pragma solidity ^0.4.16;

contract ReddappData {
    
   struct User {
        bytes32 username;
        bool verified;
    }

    modifier onlyOwners {
        require(owners[msg.sender]);
        _;
    }

    mapping(bytes32 => address) usernameToAddress;
    mapping(bytes32 => address) queryToAddress;
    mapping(bytes32 => uint) balances;
    mapping(address => User) users;   
    mapping(address => bool) owners;
    
    function ReddappData() public {
        owners[msg.sender] = true;
    }
    
    
    //getters
    function getAddressForUsername(bytes32 _username) public constant returns (address) {
        return usernameToAddress[_username];
    }

    function getAddressForQuery(bytes32 _queryId) public constant returns (address) {
        return queryToAddress[_queryId];
    }
    
    function getBalanceForUser(bytes32 _username) public constant returns (uint) {
        return balances[_username];
    }
    
    function getUserVerified(address _address) public constant returns (bool) {
        return users[_address].verified;
    }
    
    function getUserUsername(address _address) public constant returns (bytes32) {
        return users[_address].username;
    }
    
    //setters
    function setQueryIdForAddress(bytes32 _queryId, address _address) public onlyOwners {
        queryToAddress[_queryId] = _address;
    }
    
    function addBalanceForUser(bytes32 _username, uint _balance) public onlyOwners {
        balances[_username] += _balance;
    }

    function setBalanceForUser(bytes32 _username, uint _balance) public onlyOwners {
        balances[_username] = _balance;
    }
 
    function setUsernameForAddress(bytes32 _username, address _address) public onlyOwners {
        usernameToAddress[_username] = _address;
    }
    
    function addUser(address _address, bytes32 _username) public onlyOwners {
        users[_address] = User({
                username: _username,
                verified: false
            });
    }
    
    function setVerified(address _address) public onlyOwners {
        users[_address].verified = true;
    }
    
    //owner modification
    function addOwner(address _address) public onlyOwners {
        owners[_address] = true;
    }
    
    function removeOwner(address _address) public onlyOwners {
        owners[_address] = false;
    }
}


