contract Reddapp is usingOraclize {

    event Log(string tekst);
    event LogQuery(bytes32 query, address userAddress);
    event LogBalance(uint balance);
    event LogNeededBalance(uint balance);
    event CreatedUser(string username);
    event UsernameDoesNotMatch(string username, string neededUsername);
    event VerifiedUser(string username);
    event UserTipped(string username);
    event WithdrawSuccessful(string username);
    
    modifier onlyVerified() {
        require(data.getUserVerified(msg.sender));
        _;
    }

    ReddappData data;

    function Reddapp(ReddappData _data) {
        data = ReddappData(_data);
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
            UsernameDoesNotMatch(_result, usernameForAddress);
            return;
        }

        data.setVerified(queryAddress);
        data.setUsernameForAddress(stringToBytes32(_result), queryAddress);
        VerifiedUser(_result);
    }


    /**
     * Creates user with username and address
     * @param _username reddit username from user
     * @param _token reddit oauth access token (should be encrypted with oraclize public key)
     */
    function createUser(string _username, string _token) payable {
        //TODO: what happens if user with that address exists (verified or not)
        //TODO: what happens if that username is already registered with another address

        data.addUser(msg.sender, stringToBytes32(_username));

        if (oraclize_getPrice("computation") > this.balance) {
            Log("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
            LogBalance(this.balance);
            LogNeededBalance(oraclize_getPrice("computation"));
            return;
        } 
        
        string memory queryString = strConcat("[computation] ['QmQqMm8djpCVhX67DuAZYCg6SVcNsGzALcY1D1VSZT1fmy', '${[decrypt] ", _token, "}']");
        bytes32 queryId = oraclize_query("nested", queryString);
        data.setQueryIdForAddress(queryId, msg.sender);

        LogQuery(queryId, msg.sender);
        CreatedUser(_username);
    }


    /**
     * Tip user for his post/comment 
     * @param _username reddit username for user
     */
    function tipUser(string _username) payable {
        require(data.getUserVerified(data.getAddressForUsername(stringToBytes32(_username))));
        
        data.addBalanceForUser(stringToBytes32(_username), msg.value);

        UserTipped(_username);
    }

    /**
     * Withdraw collected eth 
     */
    function withdraw() onlyVerified {
        uint toSend = data.getBalanceForUser(data.getUserUsername(msg.sender));
        data.setBalanceForUser(data.getUserUsername(msg.sender), 0);
        msg.sender.transfer(toSend);

        WithdrawSuccessful(bytes32ToString(data.getUserUsername(msg.sender)));
    }


    function getAddressFromUsername(string _username) constant returns (address userAddress) {
        return data.getAddressForUsername(stringToBytes32(_username));
    }

    function checkAddressVerified() constant returns (bool) {
        return data.getUserVerified(msg.sender);
    }

    function checkUsernameVerified(string _username) constant returns (bool) {
        return data.getUserVerified(data.getAddressForUsername(stringToBytes32(_username)));
    }

    function checkBalance() onlyVerified constant returns (uint) {
        return data.getBalanceForUser(data.getUserUsername(msg.sender));
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



