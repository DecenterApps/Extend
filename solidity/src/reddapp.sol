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
        return data;
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
        string memory usernameForAddress = bytes32ToString(data.getUserUsername(queryAddress));
        //if we don't do this double conversion for some reason strCompare is not working
        if (strCompare(usernameForAddress, bytes32ToString(stringToBytes32(_result))) != 0) {
            events.usernameDoesNotMatch(_result, usernameForAddress);
            return;
        }

        data.setVerified(queryAddress);
        data.setUsernameForAddress(stringToBytes32(_result), queryAddress);
        events.verifiedUser(_result);
    }


    /**
     * Creates user with username and address
     * @param _username reddit username from user
     * @param _token reddit oauth access token (should be encrypted with oraclize public key)
     */
    function createUser(string _username, string _token) public payable {
        //TODO: what happens if user with that address exists (verified or not)
        //TODO: what happens if that username is already registered with another address

        data.addUser(msg.sender, stringToBytes32(_username));

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
        uint toSend = data.getBalanceForUser(data.getUserUsername(msg.sender));
        data.setBalanceForUser(data.getUserUsername(msg.sender), 0);
        msg.sender.transfer(toSend);

        events.withdrawSuccessful(bytes32ToString(data.getUserUsername(msg.sender)));
    }

    function refundMoneyForUser(bytes32 _username) public {
        require(data.getLastTipTime(msg.sender, _username) < (now - 2 weeks));

        uint toSend = data.getTip(msg.sender, _username);
        data.removeTip(msg.sender, _username);
        msg.sender.transfer(toSend);
    }


    function getAddressFromUsername(string _username) public constant returns (address userAddress) {
        return data.getAddressForUsername(stringToBytes32(_username));
    }

    function checkAddressVerified() public constant returns (bool) {
        CheckAddressVerified(msg.sender);
        return data.getUserVerified(msg.sender);
    }

    function checkUsernameVerified(string _username) public constant returns (bool) {
        return data.getUserVerified(data.getAddressForUsername(stringToBytes32(_username)));
    }

    function checkBalance() public onlyVerified constant returns (uint) {
        return data.getBalanceForUser(data.getUserUsername(msg.sender));
    }

    function checkIfRefundAvailable(bytes32 _username) public constant returns (bool) {
        return data.getLastTipTime(msg.sender, _username) < (now - 2 weeks);
    }

    /**
     * Convert string to bytes32
     * @param _source string to convert
     */
    function stringToBytes32(string memory _source) internal returns (bytes32 result) {
        assembly {
            result := mload(add(_source, 32))
        }
    }
    
    /**
     * Convert bytes32 to string
     * @param _data bytes32 to convert
     */
    function bytes32ToString (bytes32 _data) returns (string) {
        bytes memory bytesString = new bytes(32);
        for (uint j=0; j<32; j++) {
            byte char = byte(bytes32(uint(_data) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[j] = char;
            }
        }
        
        return string(bytesString);
    }

    function () payable {
        revert();
    }
}



