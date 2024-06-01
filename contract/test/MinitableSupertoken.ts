import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory, Contract } from "ethers";

describe("MintableSuperToken", function () {
  let MintableSuperToken: ContractFactory;
  let mintableSuperToken: Contract;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    MintableSuperToken = await ethers.getContractFactory("MintableSuperToken");
    mintableSuperToken = await MintableSuperToken.deploy();
    await mintableSuperToken.deployed();
    await mintableSuperToken.initialize(owner.address, "Super Token", "STKN");
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await mintableSuperToken.owner()).to.equal(owner.address);
    });

    it("Should set the right name and symbol", async function () {
      expect(await mintableSuperToken.name()).to.equal("Super Token");
      expect(await mintableSuperToken.symbol()).to.equal("STKN");
    });
  });

  describe("Minting", function () {
    it("Should mint tokens to the right address", async function () {
      await mintableSuperToken.mint(addr1.address, 1000);
      expect(await mintableSuperToken.balanceOf(addr1.address)).to.equal(1000);
    });

    it("Should not allow non-owners to mint", async function () {
      await expect(
        mintableSuperToken.connect(addr1).mint(addr1.address, 1000)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Burning", function () {
    it("Should burn tokens from the right address", async function () {
      await mintableSuperToken.mint(addr1.address, 1000);
      await mintableSuperToken.connect(addr1).burn(500);
      expect(await mintableSuperToken.balanceOf(addr1.address)).to.equal(500);
    });

    it("Should not allow users to burn more tokens than they have", async function () {
      await mintableSuperToken.mint(addr1.address, 1000);
      await expect(mintableSuperToken.connect(addr1).burn(1500)).to.be.reverted;
    });
  });
});