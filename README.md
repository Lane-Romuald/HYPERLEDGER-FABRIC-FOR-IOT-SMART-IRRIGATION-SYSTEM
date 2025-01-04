# Blockchain Network for Automated Irrigation Security

Welcome to the repository for our Blockchain network built on **Hyperledger Fabric**, designed to ensure the security of data exchanged between entities in an automated irrigation system. This README provides a comprehensive guide to understanding, deploying, and exploring the network.

---

## Overview
This project leverages **Hyperledger Fabric** to create a secure, distributed ledger for automated irrigation systems. By using RAFT consensus, three organizations, and a modular architecture, it ensures robust data integrity and trust.

### Key Features
- **Three Organizations:**
  - Two peer organizations: `org1.sia.com` and `org2.sia.com`.
  - One ordering service organization.
- **Node Setup:**
  - One peer per peer organization (`peer0.org1.sia.com`, `peer0.org2.sia.com`).
  - Three orderer nodes (`orderer.sia.com`, `orderer2.sia.com`, `orderer3.sia.com`) utilizing RAFT consensus.
- **Fabric CA (v1.5):** Provides partial certification authority services.
- **Hyperledger Explorer (v2.0.0):** Enables visualization of the network's components and data without compromising confidentiality.

---

## Prerequisites
Before starting, ensure the following tools are installed:
- **Docker**
- **Docker Compose**
- **cryptogen** and **configtxgen** (available with the Hyperledger Fabric binaries).

---

## Network Setup

## 0. First action:

```bash
git clone https://github.com/Lane-Romuald/HYPERLEDGER-FABRIC-FOR-IOT-SMART-IRRIGATION-SYSTEM.git
cd HYPERLEDGER-FABRIC-FOR-IOT-SMART-IRRIGATION-SYSTEM
```
### 1. Generate Cryptographic Material
We use `cryptogen` to generate the required cryptographic material.

```bash
cryptogen generate --config=./crypto-config.yaml
```

Ensure that the `crypto-config.yaml` file is present at the root of the project.

### 2. Create System Channel Artifacts
Set the `FABRIC_CFG_PATH` and generate channel artifacts using `configtxgen`:

```bash
export FABRIC_CFG_PATH=${PWD}

configtxgen -profile SampleMultiNodeEtcdRaft -channelID byfn-sys-channel -outputBlock ./channel-artifacts/genesis.block

configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID mychannel
```

### 3. Start the Network
Start the network using Docker Compose with the provided files:

```bash
docker compose -f docker-compose-cli.yaml -f docker-compose-etcdraft2.yaml up -d
```

### 4. Start the Certificate Authority
Launch the Fabric CA service:

```bash
docker compose -f docker-compose-ca.yaml up -d
```

### 5. Launch Hyperledger Explorer
Start the Explorer for network visualization:

```bash
docker compose -f docker-compose-explorer.yaml up -d
```

---

## Project Structure
- `.env`: Environment configuration file.
- `base/`: Contains base configurations for Docker Compose.
  - `docker-compose-base.yaml`: Base Docker Compose configuration.
  - `peer-base.yaml`: Configuration for peer nodes.
- `configtx.yaml`: Configuration file for creating channel artifacts.
- `crypto-config.yaml`: Configuration file for generating cryptographic material.
- `docker-compose-cli.yaml`: Docker Compose file for the CLI container.
- `docker-compose-etcdraft2.yaml`: Docker Compose file for the RAFT-based ordering service.
- `docker-compose-ca.yaml`: Docker Compose file for the Fabric CA.
- `docker-compose-explorer.yaml`: Docker Compose file for Hyperledger Explorer.
- `channel-artifacts/`: Directory containing system channel and channel configuration artifacts.
- `README.md`: This documentation file.
- `LICENSE`: License file for the project.

---

## Visualizing the Network
Hyperledger Explorer provides a user-friendly interface to:
- View network topology.
- Monitor blocks and transactions.
- Inspect smart contract interactions.

Access Explorer via the URL displayed after launching its container.

---

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to improve this project.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact
For questions or feedback, please reach out to:
- **Email:** [laneromuald@gmail.com](mailto:laneromuald@gmail.com)


---

