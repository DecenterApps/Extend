pragma solidity ^0.4.17;

import "ds-test/test.sol";

import "./Solidity.sol";

contract SolidityTest is DSTest {
    Solidity solidity;

    function setUp() public {
        solidity = new Solidity();
    }

    function testFail_basic_sanity() public {
        assertTrue(false);
    }

    function test_basic_sanity() public {
        assertTrue(true);
    }
}
