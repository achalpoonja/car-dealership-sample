pragma solidity >=0.4.21 <0.7.0;

contract Dealer{
    struct Car{
        string car_reg;
        address car_owner;
    }
    address public current_user;
    mapping (bytes32 => Car) public cars;
    constructor() public{
        current_user = msg.sender;
    }
    //modifer
    modifier transfer_ownership_verifier(address verify_user){
        require(verify_user == msg.sender, "Sender not Approved");
        _;
    }
    function addCar(string memory _car) public{
        cars[keccak256(abi.encode(_car))] = Car(_car, msg.sender);
    }
    function getCar(string memory _car) public view returns (string memory, address){
        return (cars[keccak256(abi.encode(_car))].car_reg,cars[keccak256(abi.encode(_car))].car_owner);
    }
    function transfer_ownership_init(string memory _car, address newOwner) public{
        transfer_ownership(cars[keccak256(abi.encode(_car))].car_owner, _car, newOwner);
    }
    function transfer_ownership(address car_owner, string memory _car, address newOwner) private
    transfer_ownership_verifier(car_owner)
    {
        cars[keccak256(abi.encode(_car))].car_owner = newOwner;
    }
}
