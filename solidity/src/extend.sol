pragma solidity ^0.4.17;

import './oraclize.sol';

contract ExtendOld {
    function getUsernameForAddress(address _address) public constant returns (bytes32){}
}

contract Extend is usingOraclize {

    event LogQuery(bytes32 query, address userAddress);
    event LogBalance(uint balance);
    event LogNeededBalance(uint balance);
    event CreatedUser(bytes32 username);
    event UsernameDoesNotMatch(bytes32 username, bytes32 neededUsername);
    event VerifiedUser(bytes32 username);
    event UserTipped(address from, bytes32 indexed username, uint val, bytes32 indexed commentId);
    event WithdrawSuccessful(bytes32 username);
    event CheckAddressVerified(address userAddress);
    event RefundSuccessful(address from, bytes32 username);
    event GoldBought(uint price, address from, bytes32 to, string months, string priceUsd, bytes32 indexed commentId, string nonce, string signature);

    modifier  onlyVerified() { 
        require(users[msg.sender].verified); 
        _; 
    }

   struct User {
        bytes32 username;
        bool verified;
    }
    
    mapping(bytes32 => address) public usernameToAddress;
    mapping(bytes32 => address) public queryToAddress;
    mapping(address => mapping(bytes32 => uint)) public tips;
    mapping(address => mapping(bytes32 => uint)) public lastTip;
    mapping(bytes32 => uint) public balances;
    mapping(address => User) public users;

    address public owner;
    uint public goldBalance;

    ExtendOld public oldContract;

    function Extend() public {
        owner = msg.sender;
        oldContract = ExtendOld(0x690508422D576eDb99D676320ea251036d164062);
    }

    function getOraclizePrice() public constant returns (uint) {
        return oraclize_getPrice("nested");
    }

    function getAddressFromUsername(bytes32 _username) public constant returns (address) {
        return usernameToAddress[_username];
    }

    function getUsernameForAddress(address _address) public constant returns (bytes32) {
        if (users[_address].verified){
            return users[_address].username;
        }

        return 0x0;
    }

    function checkAddressVerified() public constant returns (bool) {
        return users[msg.sender].verified;
    }

    function checkUsernameVerified(bytes32 _username) public constant returns (bool) {
        return users[usernameToAddress[_username]].verified;
    }

    function checkBalance() public onlyVerified constant returns (uint) {
        return balances[users[msg.sender].username];
    }

    function checkIfRefundAvailable(bytes32 _username) public constant returns (bool) {
        return ((lastTip[msg.sender][_username] < (now - 2 weeks)) &&
                (tips[msg.sender][_username] > 0));
    }

    function checkIfOldUser() public constant returns (bool) {
        bytes32 oldUsername = oldContract.getUsernameForAddress(msg.sender);

        if (oldUsername == 0x0){
            return false;
        }

        return true;
    }
    

    /**
     * Creates user with username and address
     * @param _username reddit username from user
     * @param _token reddit oauth access token encrypted with oraclize public key
     */
    function createUser(bytes32 _username, string _token) public payable {

        users[msg.sender] = User({
                username: _username,
                verified: false
            });

        if (oraclize_getPrice("nested") > msg.value) {
            LogBalance(msg.value);
            LogNeededBalance(oraclize_getPrice("nested"));
            return;
        } 
        
        string memory queryString = strConcat("[computation] ['QmaCikXkkUHD7cQMK3AJhTjpPmNj4hLwf3DXBzcEpM9vnL', '${[decrypt] ", _token, "}']");
        bytes32 queryId = oraclize_query("nested", queryString);
        queryToAddress[queryId] = msg.sender;

        LogQuery(queryId, msg.sender);
        CreatedUser(_username);
    }

    /**
     * Creates user that already verified his account on old contract
     */
    function createOldUser() public {
        bytes32 oldUsername = oldContract.getUsernameForAddress(msg.sender);
        require(oldUsername != 0x0);

        users[msg.sender] = User({
                username: oldUsername,
                verified: true
            });            

        usernameToAddress[oldUsername] = msg.sender;
            
        CreatedUser(oldUsername);
        VerifiedUser(oldUsername);

        //if there is tip for that username, send it to user
        if (balances[oldUsername] > 0) {
            sendTip(oldUsername, balances[oldUsername]);
        }
    }

    /**
     * Tip user for his post/comment 
     * @param _username reddit username for user
     */
    function tipUser(bytes32 _username, bytes32 _commentId) public payable {
        //add tip from-to user
        tips[msg.sender][_username] += msg.value;
        //add balance for username
        balances[_username] += msg.value;
        //remember last tip time
        lastTip[msg.sender][_username] = now; 
        
        UserTipped(msg.sender, _username, msg.value, _commentId);

        sendTip(_username, msg.value);
    }

    /**
     * Refund your money for tipping user
     * @param _username reddit username for user
     */
    function refundMoneyForUser(bytes32 _username) public {
        //last tip has to be at least 2 weeks old
        require(lastTip[msg.sender][_username] < (now - 2 weeks));
        //if username is verified we already sent eth
        require(!checkUsernameVerified(_username));
        
        uint toSend = tips[msg.sender][_username];
        //remove that from username balance
        balances[_username] -= tips[msg.sender][_username];
        //set tips from that user to 0
        tips[msg.sender][_username] = 0;

        msg.sender.transfer(toSend);

        RefundSuccessful(msg.sender, _username);
    }

    /**
     * Buy gold for user
     * @param _to reddit username for user
     * @param _months for using gold
     * @param _priceUsd price returned from server
     * @param _commentId comment on reddit
     * @param _nonce server sent
     * @param _signature server sent
     */
    function buyGold(bytes32 _to,  
                     string _months, 
                     string _priceUsd,
                     bytes32 _commentId, 
                     string _nonce, 
                     string _signature) public payable {

        goldBalance += msg.value;
        GoldBought(msg.value, msg.sender, _to, _months, _priceUsd, _commentId, _nonce,  _signature);  
    }

    function withdrawGoldMoney() public {
        require(owner == msg.sender);

        uint toSend = goldBalance;
        goldBalance = 0;
        owner.transfer(toSend);
    }

    /**
     * Function called when API gets results
     * @param _myid query id.
     * @param _result string returned from api, should be reddit username
     */
    function __callback(bytes32 _myid, string _result) {
        require(msg.sender == oraclize_cbAddress());

        address queryAddress = queryToAddress[_myid];
        bytes32 usernameFromAddress = users[queryAddress].username;
        bytes32 resultBytes = stringToBytes32(_result);

        if (usernameFromAddress != resultBytes) {
            UsernameDoesNotMatch(resultBytes, usernameFromAddress);
            return;
        }

        users[queryAddress].verified = true;
        usernameToAddress[usernameFromAddress] = queryAddress;

        VerifiedUser(usernameFromAddress);

        if (balances[usernameFromAddress] > 0) {
            sendTip(usernameFromAddress, balances[usernameFromAddress]);
        }
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

    /**
     * Send tip for user
     * @param _username reddit username for user
     * @param _value to send
     */ 
    function sendTip(bytes32 _username, uint _value) private {
        address userAddress = usernameToAddress[_username];

        if (userAddress != 0x0 && _value > 0) {
            balances[_username] = 0;
            userAddress.transfer(_value);
        }
    }

    function () payable {
        revert();
    }
}