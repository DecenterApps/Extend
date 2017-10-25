pragma solidity ^0.4.17;

contract ReddappEvents {

    event Log(string tekst);
    event LogQuery(bytes32 query, address userAddress);
    event LogBalance(uint balance);
    event LogNeededBalance(uint balance);
    event CreatedUser(string username);
    event UsernameDoesNotMatch(string username, string neededUsername);
    event VerifiedUser(string username);
    event UserTipped(address from, bytes32 indexed username, uint val);
    event WithdrawSuccessful(string username);
    event CheckAddressVerified(address userAddress);
    event RefundSuccessful(string username);

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

    function createdUser(string _username) onlyOwners {
        CreatedUser(_username);
    }

    function refundSuccessful(string _username) onlyOwners{
        RefundSuccessful(_username);
    }

    function usernameDoesNotMatch(string _username, string _neededUsername) onlyOwners{
        UsernameDoesNotMatch(_username, _neededUsername);
    }

    function verifiedUser(string _username) onlyOwners{
        VerifiedUser(_username);
    }

    function userTipped(address _from, bytes32 _username, uint _val) onlyOwners{
        UserTipped(_from, _username, _val);
    }

    function withdrawSuccessful(string _username) onlyOwners{
        WithdrawSuccessful(_username);
    }

    function logQuery(bytes32 _query, address _userAddress) onlyOwners{
        LogQuery(_query, _userAddress);
    }

    function logBalance(uint _balance) onlyOwners{
        LogBalance(_balance);
    }

    function logNeededBalance(uint _balance) onlyOwners{
        LogNeededBalance(_balance);
    }

}
