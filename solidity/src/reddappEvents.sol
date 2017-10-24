pragma solidity ^0.4.17;

contract ReddappEvents {

    event Log(string tekst);
    event LogQuery(bytes32 query, address userAddress);
    event LogBalance(uint balance);
    event LogNeededBalance(uint balance);
    event CreatedUser(string username);
    event UsernameDoesNotMatch(string username, string neededUsername);
    event VerifiedUser(string username);
    event UserTipped(address from, string username, uint val);
    event WithdrawSuccessful(string username);
    event CheckAddressVerified(address userAddress);

    mapping(address => bool) owners;

    modifier onlyOwners() {
        require(owners[msg.sender]);
        _;
    }

    function ReddappEvents() {
        owners[msg.sender] = true;
    }

    function addOwner(address _address) onlyOwners {
        owners[_address] = true;
    }

    function removeOwner(address _address) onlyOwners {
        owners[_address] = false;
    }

    function createdUser(string _username) {
        CreatedUser(_username);
    }

    function usernameDoesNotMatch(string _username, string _neededUsername) {
        UsernameDoesNotMatch(_username, _neededUsername);
    }

    function verifiedUser(string _username) {
        VerifiedUser(_username);
    }

    function userTipped(address _from, string _username, uint _val) {
        UserTipped(_from, _username, _val);
    }

    function withdrawSuccessful(string _username) {
        WithdrawSuccessful(_username);
    }

    function logQuery(bytes32 _query, address _userAddress) {
        LogQuery(_query, _userAddress);
    }

    function logBalance(uint _balance) {
        LogBalance(_balance);
    }

    function logNeededBalance(uint _balance) {
        LogNeededBalance(_balance);
    }

}
