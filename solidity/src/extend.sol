pragma solidity ^0.4.18;

contract OldData {
    mapping(bytes32 => address) public oldUsers;
    bytes32[] public allOldUsers;
    
    function OldData() public {
        allOldUsers.push("anatalist");
        allOldUsers.push("djoney_");
        allOldUsers.push("Luit03");
        allOldUsers.push("bquimper");
        allOldUsers.push("oblomov1");
        allOldUsers.push("myownman");
        allOldUsers.push("saxis");
        allOldUsers.push("bobanm");
        allOldUsers.push("screaming_for_memes");
        allOldUsers.push("playingethereum");
        allOldUsers.push("eli0tz");
        allOldUsers.push("BrBaumann");
        allOldUsers.push("sunstrikuuu");
        allOldUsers.push("RexetBlell");
        allOldUsers.push("some_random_user_0");
        allOldUsers.push("SterLu");
        allOldUsers.push("besoisinovi");
        allOldUsers.push("Matko95");
        
        oldUsers["anatalist"] = 0xC11B1890aE2c0F8FCf1ceD3917D92d652e5e7E11;
        oldUsers["djoney_"] = 0x0400c514D8a63CF6e33B5C42994257e9F4f66dE0;
        oldUsers["Luit03"] = 0x19DB8629bCCDd0EFc8F89cE1af298D31329320Ec;
        oldUsers["bquimper"] = 0xaB001dAb0D919A9e9CafE79AeE6f6919845624f8;
        oldUsers["oblomov1"] = 0xC471df16A1B1082F9Be13e70dAa07372C7AC355f;
        oldUsers["myownman"] = 0x174252aE3327DD8cD16fE3883362D0BAB7Fb6f3b;
        oldUsers["saxis"] = 0x27cb2A354E2907B0b5F03BB03d1B740a55A5a562;
        oldUsers["bobanm"] = 0x45E0F19aDfeaD31eB091381FCE05C5DE4197DD9c;
        oldUsers["screaming_for_memes"] = 0xfF3a0d4F244fe663F1a2E2d87D04FFbAC0910e0E;
        oldUsers["playingethereum"] = 0x23dEd0678B7e41DC348D1D3F2259F2991cB21018;
        oldUsers["eli0tz"] = 0x0b4F0F9CE55c3439Cf293Ee17d9917Eaf4803188;
        oldUsers["BrBaumann"] = 0xE6AC244d854Ccd3de29A638a5A8F7124A508c61D;
        oldUsers["sunstrikuuu"] = 0xf6246dfb1F6E26c87564C0BB739c1E237f5F621c;
        oldUsers["RexetBlell"] = 0xc4C929484e16BD693d94f9903ecd5976E9FB4987;
        oldUsers["some_random_user_0"] = 0x69CC780Bf4F63380c4bC745Ee338CB678752301a;
        oldUsers["SterLu"] = 0xe07caB35275C4f0Be90D6F4900639EC301Fc9b69;
        oldUsers["besoisinovi"] = 0xC834b38ba4470b43537169cd404FffB4d5615f12;
        oldUsers["Matko95"] = 0xC26bf0FA0413d9a81470353589a50d4fb3f92a30;
    }
    
    function getArrayLength() public view returns(uint) {
        return allOldUsers.length;
    }
}

contract Extend is usingOraclize {

    event LogQuery(bytes32 query, address userAddress);
    event LogBalance(uint balance);
    event LogNeededBalance(uint balance);
    event CreatedUser(bytes32 username);
    event UsernameDoesNotMatch(bytes32 username, bytes32 neededUsername);
    event VerifiedUser(bytes32 username, address userAddress);
    event UserTipped(address from, bytes32 indexed username, uint val, bytes32 indexed commentId, bool reply);
    event WithdrawSuccessful(bytes32 username);
    event CheckAddressVerified(address userAddress);
    event RefundSuccessful(address from, bytes32 username);
    event GoldBought(uint price, address from, bytes32 to, string months, string priceUsd, bytes32 indexed commentId, string nonce, string signature, bool reply);

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

    OldData public oldData;

    function Extend(address _oldData) public {
        oldData = OldData(_oldData);
        owner = msg.sender;
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);

        createOldUsers();
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
     * Function called when API gets results
     * @param _myid query id.
     * @param _result string returned from api, should be reddit username
     * @param _proof oraclize proof for TLSNotary
     */
    function __callback(bytes32 _myid, string _result, bytes _proof) {
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

        VerifiedUser(usernameFromAddress, queryAddress);

        if (balances[usernameFromAddress] > 0) {
            sendTip(usernameFromAddress, balances[usernameFromAddress]);
        }
    }

    /**
     * Tip user for his post/comment 
     * @param _username reddit username for user
     * @param _commentId comment id
     * @param _reply reply to reddit thread
     */
    function tipUser(bytes32 _username, bytes32 _commentId, bool _reply) public payable {
        //add tip from-to user
        tips[msg.sender][_username] += msg.value;
        //add balance for username
        balances[_username] += msg.value;
        //remember last tip time
        lastTip[msg.sender][_username] = now; 
        
        UserTipped(msg.sender, _username, msg.value, _commentId, _reply);

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
     * @param _reply reply to reddit thread
     */
    function buyGold(bytes32 _to,  
                     string _months, 
                     string _priceUsd,
                     bytes32 _commentId, 
                     string _nonce, 
                     string _signature,
                     bool _reply) public payable {

        goldBalance += msg.value;
        GoldBought(msg.value, msg.sender, _to, _months, _priceUsd, _commentId, _nonce,  _signature, _reply);  
    }

    /**
     * Owner can withdraw ethers sent for buying gold on Reddit
     */
    function withdrawGoldMoney() public {
        require(owner == msg.sender);

        uint toSend = goldBalance;
        goldBalance = 0;
        owner.transfer(toSend);
    }

    /**
     * Convert string to bytes32
     * @param _source string to convert
     */
    function stringToBytes32(string memory _source) private returns (bytes32 result) {
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

    /**
     * Create already verified users from old contract
     */
    function createOldUsers() private {
        uint arrayLen = oldData.getArrayLength();

        for (uint i=0; i<arrayLen; i++){
            bytes32 oldUsername = oldData.allOldUsers(i);
            address oldAddress = oldData.oldUsers(oldData.allOldUsers(i));
            
            users[oldAddress] = User({
                username: oldUsername,
                verified: true
            });

            usernameToAddress[oldUsername] = oldAddress;

            CreatedUser(oldUsername);
            VerifiedUser(oldUsername, oldAddress);
        }
    }

    function () payable {
        revert();
    }
}