// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script, console } from "forge-std/Script.sol";
import { Tesseract } from "../contracts/Tesseract.sol";

contract DeployTesseract is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address deployerAddress = vm.addr(deployerPrivateKey);
        Tesseract tesseract = new Tesseract(deployerAddress);

        vm.stopBroadcast();

        console.log("Tesseract deployed to:", address(tesseract));
    }
}
