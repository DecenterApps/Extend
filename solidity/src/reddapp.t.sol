pragma solidity ^0.4.17;

import "ds-test/test.sol";

import "./reddapp.sol";
import "./reddappData.sol";
import "./reddappEvents.sol";

contract ReddappTest is DSTest, ReddappEvents {
    Reddapp reddapp;
    ReddappData data;
    bytes32 myUsername = "Nikola";
    address myAddress = 0x1;

    function setUp() public {
        reddapp = new Reddapp();
        data = ReddappData(reddapp.getDataAddress());

        data.addUser(myAddress, myUsername);
        data.setVerified(myAddress);
        data.setUsernameForAddress(myUsername, myAddress);
    }

    //should fail because its not call from oraclize address
    function testFail_callback_not_oraclize() public {
        reddapp.__callback("", "");
    }

    function test_tipUser() {
        uint toSend = 1000000;
        reddapp.tipUser.value(toSend)(myUsername); 

        assert(data.getBalanceForUser(myUsername) == toSend);  
    }

    function testFail_tipUser() {
        uint toSend = 1000000;
        reddapp.tipUser.value(toSend)(myUsername);

        assert(data.getBalanceForUser(myUsername) != toSend);    
    }

    function test_addressForUsername() {
        assert(myAddress == reddapp.getAddressFromUsername(myUsername));
    }

    function test_checkAddressVerified() {
        assert(!reddapp.checkAddressVerified());
        data.setVerified(this);
        assert(reddapp.checkAddressVerified());
    }

    function test_checkUsernameVerified() {
        assert(reddapp.checkUsernameVerified(myUsername));
        assert(!reddapp.checkUsernameVerified("rnd"));
    }

    function testFail_checkBalance() {
        reddapp.checkBalance();
    }

    function test_checkBalance() {
        
        data.addUser(this, "dj");
        data.setVerified(this);
        data.setUsernameForAddress("dj", this);
        assert(reddapp.checkBalance() == 0);
        
        reddapp.tipUser.value(100000)("dj");
        assert(reddapp.checkBalance() == 100000);
    }

    function testFail_withdraw() {
        reddapp.withdraw();
    }

    function testFail_refund() {
        uint val = 100000;
        reddapp.tipUser.value(val)(myUsername);

        reddapp.refundMoneyForUser(myUsername);
    }

    function testFail_checkIfRefundable() {
        uint val = 10000;
        reddapp.tipUser.value(val)(myUsername);

        assert(reddapp.checkIfRefundAvailable(myUsername));
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
}
