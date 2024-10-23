/*
 * Lane Romuald. All Rights Reserved.
 *
 * laneromuald@gmail.com
 */


const express = require('express');
const cors = require('cors');
//const http = require('http');
const https = require('https');
const fs = require('fs');
const axios=require('axios');
const bodyParser = require('body-parser');

//Modèle de Prédiction 
const { spawn } = require('child_process');
const app = express();
app.use(express.json());
app.use(cors());

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

const hostname = '0.0.0.0';
const port = process.env.PORT || '3000';
const ip = '192.168.43.232';



// Quelques Variables
ID_user="";
Password_user="";

IID_user="";
IPassword_user="";

ID_capteur="";
ID_actionneur=0;

Model_response=0;

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../application_web/ressources/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../application_web/ressources/AppUtil.js');
const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'smartaicc';

const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'Romuald';
// Définir le dossier contenant les fichiers statiques
//const staticFilesPath=path.join(__dirname, 'pages');
//app.use("/pages", express.static('./pages'));
// Définir le dossier contenant les fichiers statiques
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static('pages'))

// Read the key and certificate files
const credentials = {
// Read the private key file
	key: fs.readFileSync('./certificate/tls.key'),
	// Read the certificate file
	cert: fs.readFileSync('./certificate/tls.crt'),
	ca: fs.readFileSync('./certificate/rootCA.pem'),  
	};
// Middleware pour parser les données du formulaire
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Client IP: ${clientIp}`);
    next();
});

// Route principale pour servir votre page HTML principale, par exemple


function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


/* LES ROUTINE DE NOTRE SERVEUR*/

//Page d'acceuil
app.get('/sai', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'accueil.html'));
});

//Page de connexion Utilisateur
app.get('/sai/acces', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'accueil.html'));
});

// Récupération des paramètres de connexion pour test
app.post('/sai/connexions', async function (req, res) {
	
				console.log('\n--> Données de connexion : ');
				console.log(req.body.id);
				console.log(req.body.password);
				ID_user = req.body.id;
				Password_user=req.body.password;
				try {
				const f=await axios.get('https://192.168.43.232:3000/sai/connexion');
			} catch (error) {
				console.error(error);
			}
		});

//Validation de paramètre de connexion
app.get('/sai/connexion', async function (req, res) {
	
    try {
		const ccp = buildCCPOrg1();
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.sia.com');
		const wallet = await buildWallet(Wallets, walletPath);
		await enrollAdmin(caClient, wallet, mspOrg1);
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
		const gateway = new Gateway();
		await gateway.connect(ccp, {
			wallet,
			identity: org1UserId,
		});
		const network = await gateway.getNetwork(channelName);
		const contract = network.getContract(chaincodeName);
		console.log('\n--> Evaluate Transaction: OwnerConnexion');
		result = await contract.evaluateTransaction('OwnerConnexion', ID_user);
		console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		datax=prettyJSONString(result.toString());
		const jsonObject = JSON.parse(datax);
		// Extraction des valeurs
		const id_p = jsonObject.ID_p;
		const pwd_p = jsonObject.PWD_p;

		// Affichage des valeurs
		console.log(id_p);
		console.log(pwd_p);

	
		res.json(datax);
			// Disconnect from the gateway.
			await gateway.disconnect();

} catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        
    }
});

//Autorisation de connexion
app.get('/sai/login', async function (req, res) {
		
	login="OK"
	console.log("login page");
	res.json(login);
			
	});

// Inscription d'un utilisateur
app.post('/sai/inscription', async function (req, res) {
    try {  // build an in memory object with the network configuration (also known as a connection profile)

		const ccp = buildCCPOrg1();
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.sia.com');
		const wallet = await buildWallet(Wallets, walletPath);
		await enrollAdmin(caClient, wallet, mspOrg1);
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
		const gateway = new Gateway();
		await gateway.connect(ccp, {
			wallet,
			identity: org1UserId,
		});
		const network = await gateway.getNetwork(channelName);
		const contract = network.getContract(chaincodeName);
			console.log('\n--> Transaction Inscription : Noveau utilisateur');
			console.log(req.body.username);
			console.log(req.body.password);
			//result = await contract.submitTransaction('CreateAsset', 'data3', '29', '28', '27', '67','89','0.58');
			result = await contract.submitTransaction('OwnerInscription', req.body.username, req.body.password);
			console.log('Inscription réussie !!');
			IID_user=req.body.username;
			IPassword_user=req.body.password;
			try {
				const f=await axios.get('https://192.168.43.232:3000/sai/login');
			} catch (error) {
				console.error(error);
			}
			//res.send('Transaction has been submitted');
			//ID_save=req.body.ID;
			//Model_I(req.body.HS, req.body.TS, req.body.TA, req.body.HR,req.body.PP);
			await gateway.disconnect();

	} catch (error) {
        console.error(`Echec de transaction d'inscription : ${error}`);
    }});

// Page d'inscription utilisateur
app.get('/sai/register', (req, res) => {
		res.sendFile(path.join(__dirname, 'pages', 'inscription.html'));
	});

// Page de présentation des cultures
app.get('/sai/culture', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'culture.html'));
});

// Page de présentation du Tableau de surveillance
app.get('/sai/surveillance', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'tdb.html'));
});

// Routine de gestion des capteurs
app.get('/sai/capteur', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'capteurs.html'));
});

// Routine de mise à jour des données d'un capteur
app.post('/sai/datasensor/', async function (req, res) {
    try { 
		const ccp = buildCCPOrg1();
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.sia.com');
		const wallet = await buildWallet(Wallets, walletPath);
		await enrollAdmin(caClient, wallet, mspOrg1);
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
		const gateway = new Gateway();
		await gateway.connect(ccp, {
			wallet,
			identity: org1UserId,
		});
		const network = await gateway.getNetwork(channelName);
		const contract = network.getContract(chaincodeName);
			console.log('\n--> Submit Transaction:UpdateBlockSensorAsset, update asset with ID, Propriétaire,culture,HS, TS, TA, HR, PP, QP');
			result = await contract.submitTransaction('UpdateBlockSensorAsset', req.body.ID_bc, req.body.ID_pbc,req.body.Culture_bc,req.body.HS, req.body.TS, req.body.TA, req.body.HR,req.body.PP,req.body.QP);
			console.log('Capteur mise à jour');
			ID_capteur=req.body.ID_bc;
			await gateway.disconnect();

	} catch (error) {
        console.error(`Erreur de mise à jour des valeurs du capteur: ${error}`);
      
    }});

// Routine de lecture des paramètre d'un actif capteur
app.get('/sai/datasensorid', async function (req, res) {
	
		try {
			const ccp = buildCCPOrg1();
			const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.sia.com');
			const wallet = await buildWallet(Wallets, walletPath);
			await enrollAdmin(caClient, wallet, mspOrg1);
			await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
			const gateway = new Gateway();
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
			});
			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);
			console.log('\n--> Evaluate Transaction: ReadBlocksensorAsset');
			result = await contract.evaluateTransaction('ReadBlocksensorAsset', ID_capteur);
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			datax=prettyJSONString(result)
			res.json(datax);
				// Disconnect from the gateway.
				await gateway.disconnect();
	
	} catch (error) {
			console.error(`Failed to evaluate transaction: ${error}`);
			res.status(500).json({error: error});
			
		}
	});

// Routine de gestion des actionneurs
app.get('/sai/actionneur', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'actionneurs.html'));
});

// Routine de présentation de la page de contrôle manuel des actionneurs
app.get('/sai/controle', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'controle.html'));
});

// Routine de lecture des paramètre d'un actif actionneur
app.get('/sai/dataactuatorid', async function (req, res) {
	
		try {
			const ccp = buildCCPOrg1();
			const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.sia.com');
			const wallet = await buildWallet(Wallets, walletPath);
			await enrollAdmin(caClient, wallet, mspOrg1);
			await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
			const gateway = new Gateway();
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
			});
			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);
			console.log('\n--> Evaluate Transaction: ReadBlockactuatorAsset');
			result = await contract.evaluateTransaction('ReadBlockactuatorAsset', "Bloc_actioneur_0");
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			datax=prettyJSONString(result)
			res.json(datax);
				// Disconnect from the gateway.
				await gateway.disconnect();
	
	} catch (error) {
			console.error(`Failed to evaluate transaction: ${error}`);
			res.status(500).json({error: error});
			
		}
	});

	
// Fonction de gestion du Modèle de ML
function Model_I(C1,C2,C3,C4,C5) {

	let dataToSend;
	// spawn new child process to call the python script 
	// and pass the variable values to the python script
	const python = spawn('python', ['./model.py', C1, C2,C3,C4,C5]);
	// collect data from script
	python.stdout.on('data', function (data) {
		console.log('Pipe data from python script ...');
		dataToSend = data.toString();
	});
	// in close event we are sure that stream from child process is closed
	python.on('close', (code) => {
		console.log(`child process close all stdio with code ${code}`);
		// send data to browser
		//res.send(dataToSend)
		Model_response = parseInt(dataToSend, 10)
		console.log(dataToSend);
	});
	
	  }
//Routine d'interaction avec le modèle
app.get('/run-python', (req, res) => {

		const C1 = -2.11;
		const C2 = -1.53;
		const C3 = 0.02;
		const C4 = 0.63;
		const C5 = -1.13;
	
		let dataToSend;
		// spawn new child process to call the python script 
		// and pass the variable values to the python script
		const python = spawn('python', ['./model.py', C1, C2,C3,C4,C5]);
		// collect data from script
		python.stdout.on('data', function (data) {
			console.log('Pipe data from python script ...');
			dataToSend = data.toString();
		});
		// in close event we are sure that stream from child process is closed
		python.on('close', (code) => {
			console.log(`child process close all stdio with code ${code}`);
			// send data to browser
			res.send(dataToSend)
		});
	
	});

// Routine de contrôle manuelle des actionneurs
app.post('/sai/manuelle/', async function (req, res) {
	try { 
		const ccp = buildCCPOrg1();
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.sia.com');
		const wallet = await buildWallet(Wallets, walletPath);
		await enrollAdmin(caClient, wallet, mspOrg1);
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
		const gateway = new Gateway();
		await gateway.connect(ccp, {
			wallet,
			identity: org1UserId,
		});
		const network = await gateway.getNetwork(channelName);
		const contract = network.getContract(chaincodeName);
			console.log('\n--> Submit Transaction:UpdateBlockActuatorAsset');
			result = await contract.submitTransaction('UpdateBlockActuatorAsset', req.body.ID_ba, req.body.ID_pba,req.body.Culture_ba,req.body.Etat);
			console.log('Etat actionneur mise à jour');
			ID_actionneur=req.body.Etat;
			
			console.log(req.body.ID_ba);
			console.log(req.body.ID_pba);
			console.log(req.body.Culture_ba);
			console.log(req.body.Etat);
			
			await gateway.disconnect();
			
			} catch (error) {
				console.error(`Erreur de mise à jour Etat actionneur: ${error}`);
			
			}
	});

// Routine de lecture de récupération de l'état de l'actionneur
app.get('/value', (req, res) => {
		const value = ID_actionneur; // La valeur que vous souhaitez retourner
		//console.log(value);
		// Envoyer la valeur au format JSON
		res.json({ value: value });
	  });
	
//const httpsServer = https.createServer(credentials, app);
const httpsServer = https.createServer(credentials,app);	
httpsServer.listen(port ,ip,() => {
	console.log(`Listening to requests on https://${ip}:${port}`);
  });



  