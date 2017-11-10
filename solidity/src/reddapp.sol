pragma solidity ^0.4.17;

import './reddappData.sol';
import './oraclize.sol';
import './reddappEvents.sol';

contract Reddapp is usingOraclize {

    modifier onlyVerified() {
        require(data.getUserVerified(msg.sender));
        _;
    }
    
    ReddappData data;
    ReddappEvents events;
    address owner;

    function Reddapp(ReddappData _data, ReddappEvents _events) public {
        data = ReddappData(_data);
        events = ReddappEvents(_events);
        owner = msg.sender;
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
        bytes32 resultBytes = stringToBytes32(_result);
        
        if (usernameForAddress != resultBytes) {
            events.usernameDoesNotMatch(resultBytes, usernameForAddress);
            return;
        }

        data.setVerified(queryAddress);
        data.setUsernameForAddress(usernameForAddress, queryAddress);
        events.verifiedUser(usernameForAddress);

        sendTip(usernameForAddress, data.getBalanceForUser(usernameForAddress));
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

        if (oraclize_getPrice("computation") > msg.value) {
            events.logBalance(msg.value);
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
        sendTip(_username, msg.value);
    }

    function sendTip(bytes32 _username, uint _value) private {
        address userAddress = getAddressFromUsername(_username);
        if (userAddress != 0x0 && _value > 0) {
            data.setBalanceForUser(_username, 0);
            userAddress.transfer(_value);
        }
    }

    function refundMoneyForUser(bytes32 _username) public {
        require(data.getLastTipTime(msg.sender, _username) < (now - 2 weeks));
        require(!checkUsernameVerified(_username));

        uint toSend = data.getTip(msg.sender, _username);
        data.removeTip(msg.sender, _username);
        msg.sender.transfer(toSend);

        events.refundSuccessful(msg.sender, _username);
    }

    function buyGold(bytes32 _to,  
                     string _months, 
                     string _priceUsd, 
                     string _nonce, 
                     string _signature) public payable {

        owner.transfer(msg.value);
        events.goldBought(msg.value, msg.sender, _to, _months, _priceUsd, _nonce,  _signature);  
    }

    function getAddressFromUsername(bytes32 _username) public constant returns (address userAddress) {
        return data.getAddressForUsername(_username);
    }

    function checkAddressVerified() public constant returns (bool) {
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

    /**
     * Convert string to bytes32
     * @param _source string to convert
     */
    function stringToBytes32(string memory _source) internal returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(_source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        
        assembly {
            result := mload(add(_source, 32))
        }
    }

    function () payable {
        revert();
    }
}



