// @ts-ignore
import TesseractABI from "../src/abi/Tesseract.json";

const TESSERACT_CONTRACT_ADDRESS = "0xDB35E24179ccb7c010Ec5C99cc952105c80789Eb";

export const contractConfig = {
  address: TESSERACT_CONTRACT_ADDRESS,
  abi: TesseractABI.abi,
};

export const SEPOLIA_CHAIN_ID = 11155111;

export const LOCAL_RPC_URL = "http://localhost:3002";