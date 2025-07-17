import TesseractABI from '@/abi/Tesseract.json';

const TESSERACT_CONTRACT_ADDRESS = "0xD4282819b3CC1599009d5ECa739CAB665326f519";

export const contractConfig = {
  address: TESSERACT_CONTRACT_ADDRESS,
  abi: TesseractABI.abi,
};

export const SEPOLIA_CHAIN_ID = 11155111;

export const LOCAL_RPC_URL = "http://localhost:3002";