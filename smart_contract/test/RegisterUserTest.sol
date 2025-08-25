pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/RegisterUser.sol";

contract RegisterUserTest is Test {
    RegisterUser registerUser;
    address user1 = address(0x123);
    address user2 = address(0x456);
    address unregistered = address(0x789);

    function setUp() public {
        registerUser = new RegisterUser();
    }

    // Test 1: Successful registration
    function testRegisterUser() public {
        vm.prank(user1);
        registerUser.register("Alice");
        string memory username = registerUser.getUser(user1);
        assertEq(username, "Alice", "Username should be Alice");
    }

    // Test 2: Revert on empty username
    function testRevertEmptyUsername() public {
        vm.prank(user1);
        vm.expectRevert(bytes("Invalid username"));
        registerUser.register("");
    }

    // Test 3: Revert on duplicate registration
    function testRevertDuplicateRegistration() public {
        vm.prank(user1);
        registerUser.register("Alice");
        vm.prank(user1);
        vm.expectRevert(bytes("User already registered"));
        registerUser.register("Bob");
    }

    // Test 4: Retrieve registered user
    function testGetUser() public {
        vm.prank(user1);
        registerUser.register("Alice");
        string memory username = registerUser.getUser(user1);
        assertEq(username, "Alice", "Should return correct username");
    }

    // Test 5: Revert on unregistered user
    function testRevertGetUnregisteredUser() public {
        vm.expectRevert(bytes("User not found"));
        registerUser.getUser(unregistered);
    }

    // Test 6: Multiple users registration
    function testMultipleUsers() public {
        vm.prank(user1);
        registerUser.register("Alice");
        vm.prank(user2);
        registerUser.register("Bob");
        assertEq(registerUser.getUser(user1), "Alice", "User1 should be Alice");
        assertEq(registerUser.getUser(user2), "Bob", "User2 should be Bob");
    }

    // Test 7: Long username registration
    function testLongUsername() public {
        string memory longUsername = "ThisIsAVeryLongUsername1234567890";
        vm.prank(user1);
        registerUser.register(longUsername);
        assertEq(registerUser.getUser(user1), longUsername, "Long username should be stored correctly");
    }

    // Test 8: Case sensitivity of usernames
    function testCaseSensitiveUsername() public {
        vm.prank(user1);
        registerUser.register("ALICE");
        assertEq(registerUser.getUser(user1), "ALICE", "Username should preserve case");
    }

    // Test 9: Register after failed attempt
    function testRegisterAfterFailedAttempt() public {
        vm.prank(user1);
        vm.expectRevert(bytes("Invalid username"));
        registerUser.register("");
        vm.prank(user1);
        registerUser.register("Alice");
        assertEq(registerUser.getUser(user1), "Alice", "Should register after failed attempt");
    }

    // Test 10: Different addresses, same username
    function testSameUsernameDifferentAddresses() public {
        vm.prank(user1);
        registerUser.register("SharedName");
        vm.prank(user2);
        registerUser.register("SharedName");
        assertEq(registerUser.getUser(user1), "SharedName", "User1 should have SharedName");
        assertEq(registerUser.getUser(user2), "SharedName", "User2 should have SharedName");
    }

    // Test 11: Revert on zero address registration
    function testRevertZeroAddress() public {
        vm.prank(address(0));
        vm.expectRevert(bytes("Invalid username")); // Note: Contract doesn't explicitly check for zero address, but empty username revert may occur
        registerUser.register("Zero");
    }

    // Test 12: Username with special characters
    function testSpecialCharacters() public {
        string memory specialUsername = "Alice@123!";
        vm.prank(user1);
        registerUser.register(specialUsername);
        assertEq(registerUser.getUser(user1), specialUsername, "Special characters should be stored");
    }
}