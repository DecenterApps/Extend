pragma solidity ^0.4.17;

import './reddappData.sol';
import './oraclize.sol';
import './reddappEvents.sol';

contract Reddapp is usingOraclize {

    event Log(string tekst);
    event CheckAddressVerified(address userAddress);

    modifier onlyVerified() {
        require(data.getUserVerified(msg.sender));
        _;
    }

    ReddappData data;
    ReddappEvents events;

    function Reddapp() public {
        data = new ReddappData();
        data.addOwner(msg.sender);
        events = new ReddappEvents();
        events.addOwner(msg.sender);
    } 

    function getDataAddress() public constant returns (address) {
        return address(data);
    }

    function getEventsAddress() public constant returns (address) {
        return address(events);
    }
    

    /**
     * Function called when API gets results
     * @param _myid query id.
     * @param _result string returned from api
     */
    function __callback(bytes32 _myid, string _result) {

        require(msg.sender == oraclize_cbAddress());
        
        address queryAddress = data.getAddressForQuery(_myid);
        bytes32 usernameForAddress = data.getUserUsername(queryAddress);
        //if we don't do this double conversion for some reason strCompare is not working
        if (usernameForAddress != keccak256(_result)) {
            events.usernameDoesNotMatch(keccak256(_result), usernameForAddress);
            return;
        }

        data.setVerified(queryAddress);
        data.setUsernameForAddress(usernameForAddress, queryAddress);
        events.verifiedUser(usernameForAddress);
    }

    function getOraclizePrice() public constant returns (uint) {
        return oraclize_getPrice("computation");
    }

    /**
     * Creates user with username and address
     * @param _username reddit username from user
     * @param _token reddit oauth access token (should be encrypted with oraclize public key)
     */
    function createUser(bytes32 _username, string _token) public payable {
        //TODO: what happens if user with that address exists (verified or not)
        //TODO: what happens if that username is already registered with another address

        data.addUser(msg.sender, _username);

        if (oraclize_getPrice("computation") > this.balance) {
            Log("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
            events.logBalance(this.balance);
            events.logNeededBalance(oraclize_getPrice("computation"));
            return;
        } 
        
        string memory queryString = strConcat("[computation] ['QmQqMm8djpCVhX67DuAZYCg6SVcNsGzALcY1D1VSZT1fmy', '${[decrypt] ", _token, "}']");
        bytes32 queryId = oraclize_query("nested", queryString);
        data.setQueryIdForAddress(queryId, msg.sender);

        events.logQuery(queryId, msg.sender);
        events.createdUser(_username);
    }


    /**
     * Tip user for his post/comment 
     * @param _username reddit username for user
     */
     function tipUser(bytes32 _username) public payable {
        data.addTip(msg.sender, _username, msg.value);

        events.userTipped(msg.sender, _username, msg.value);
    }

    /**
     * Withdraw collected eth 
     */
    function withdraw() public onlyVerified {
        bytes32 _username = data.getUserUsername(msg.sender);
        uint toSend = data.getBalanceForUser(_username);
        data.setBalanceForUser(_username, 0);
        data.setLastWithdraw(_username);
        msg.sender.transfer(toSend);

        events.withdrawSuccessful(_username);
    }

    function refundMoneyForUser(bytes32 _username) public {
        require(data.getLastTipTime(msg.sender, _username) < (now - 2 weeks));
        require(data.getLastTipTime(msg.sender, _username) > data.getLastWithdraw(_username));

        uint toSend = data.getTip(msg.sender, _username);
        data.removeTip(msg.sender, _username);
        msg.sender.transfer(toSend);

        events.refundSuccessful(_username);
    }

    function getAddressFromUsername(bytes32 _username) public constant returns (address userAddress) {
        return data.getAddressForUsername(_username);
    }

    function checkAddressVerified() public constant returns (bool) {
        CheckAddressVerified(msg.sender);
        return data.getUserVerified(msg.sender);
    }

    function checkUsernameVerified(bytes32 _username) public constant returns (bool) {
        return data.getUserVerified(data.getAddressForUsername(_username));
    }

    function checkBalance() public onlyVerified constant returns (uint) {
        return data.getBalanceForUser(data.getUserUsername(msg.sender));
    }

    function checkIfRefundAvailable(bytes32 _username) public constant returns (bool) {
        return data.getLastTipTime(msg.sender, _username) < (now - 2 weeks);
    }

    function () payable {
        revert();
    }
}



