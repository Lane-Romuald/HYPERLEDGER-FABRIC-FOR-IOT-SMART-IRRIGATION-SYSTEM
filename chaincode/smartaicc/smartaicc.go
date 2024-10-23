package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

// Definition des Actifs partagés dans le réseau
// Actif capteur
type Bloc_Capteur struct {
	ID_bc      string  `json:"ID_bc"`
	ID_pbc     string  `json:"ID_pbc"`
	Culture_bc int     `json:"Culture_bc"`
	HS         int     `json:"HS"`
	TS         int     `json:"TS"`
	TA         int     `json:"TA"`
	HR         int     `json:"HR"`
	PP         int     `json:"PP"`
	QP         float32 `json:"QP"`
}

// Actif actionneur
type Bloc_Actionneur struct {
	ID_ba      string `json:"ID_ba"`
	ID_pba     string `json:"ID_pba"`
	Culture_ba int    `json:"Culture_ba"`
	Etat       int    `json:"Etat"`
}
type Proprietaire struct {
	ID_p  string `json:"ID_p"`
	PWD_p string `json:"PWD_p"`
}

// Fonction pour l'actif capteur

func (s *SmartContract) InitBlockSensorAsset(ctx contractapi.TransactionContextInterface) error {

	// Actif de base bc
	assets := []Bloc_Capteur{
		{ID_bc: "Bloc_capteur_0", ID_pbc: "Admin_1234", Culture_bc: 1, HS: 0, TS: 0, TA: 0, HR: 0, PP: 0, QP: 0.0},
	}

	for _, asset := range assets {
		assetJSON, err := json.Marshal(asset)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(asset.ID_bc, assetJSON)
		if err != nil {
			return fmt.Errorf("impossible de mettre en place world state. %v", err)
		}
	}

	return nil
}
func (s *SmartContract) CreateBlockSensorAsset(ctx contractapi.TransactionContextInterface, idbc string, idpbc string, cbc int, hs int, ts int, ta int, hr int, pp int, qp float32) error {
	exists, err := s.AssetExists(ctx, idbc)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("le bloc capteur %s est existant", idbc)
	}

	asset := Bloc_Capteur{
		ID_bc:      idbc,
		ID_pbc:     idpbc,
		Culture_bc: cbc,
		HS:         hs,
		TS:         ts,
		TA:         ta,
		HR:         hr,
		PP:         pp,
		QP:         qp,
	}
	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(idbc, assetJSON)
}
func (s *SmartContract) UpdateBlockSensorAsset(ctx contractapi.TransactionContextInterface, idbc string, idpbc string, cbc int, hs int, ts int, ta int, hr int, pp int, qp float32) error {

	asset := Bloc_Capteur{
		ID_bc:      idbc,
		ID_pbc:     idpbc,
		Culture_bc: cbc,
		HS:         hs,
		TS:         ts,
		TA:         ta,
		HR:         hr,
		PP:         pp,
		QP:         qp,
	}
	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(idbc, assetJSON)
}
func (s *SmartContract) DeleteBlockSensorAsset(ctx contractapi.TransactionContextInterface, idbc string) error {
	exists, err := s.AssetExists(ctx, idbc)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("le bloc capteur %s est exexistant", idbc)
	}

	return ctx.GetStub().DelState(idbc)
}
func (s *SmartContract) GetAllBlockSensorAssets(ctx contractapi.TransactionContextInterface) ([]*Bloc_Capteur, error) {

	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var assets []*Bloc_Capteur
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var asset Bloc_Capteur
		err = json.Unmarshal(queryResponse.Value, &asset)
		if err != nil {
			return nil, err
		}
		assets = append(assets, &asset)
	}

	return assets, nil
}
func (s *SmartContract) ReadBlocksensorAsset(ctx contractapi.TransactionContextInterface, id string) (*Bloc_Capteur, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("ereur de lecture dans world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf(" %s est Bloc capteur non existant", id)
	}

	var asset Bloc_Capteur
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return nil, err
	}

	return &asset, nil
}

// Fonction pour l'actif actionneur
func (s *SmartContract) InitBlockActuatorAsset(ctx contractapi.TransactionContextInterface) error {

	// Actif de base ba
	assets := []Bloc_Actionneur{
		{ID_ba: "Bloc_actioneur_0", ID_pba: "Admin_1234", Culture_ba: 1, Etat: 0},
	}

	for _, asset := range assets {
		assetJSON, err := json.Marshal(asset)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(asset.ID_ba, assetJSON)
		if err != nil {
			return fmt.Errorf("impossible de mettre en place world state. %v", err)
		}
	}

	return nil
}
func (s *SmartContract) CreateBlockActuatorAsset(ctx contractapi.TransactionContextInterface, idba string, idpba string, cba int, etat int) error {
	exists, err := s.AssetExists(ctx, idba)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("le bloc actionneur %s est existant", idba)
	}

	asset := Bloc_Actionneur{
		ID_ba:      idba,
		ID_pba:     idpba,
		Culture_ba: cba,
		Etat:       etat,
	}
	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(idba, assetJSON)
}
func (s *SmartContract) UpdateBlockActuatorAsset(ctx contractapi.TransactionContextInterface, idba string, idpba string, cba int, etat int) error {
	exists, err := s.AssetExists(ctx, idba)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf(" %s Est un Bloc actionneur non existant", idba)
	}

	asset := Bloc_Actionneur{
		ID_ba:      idba,
		ID_pba:     idpba,
		Culture_ba: cba,
		Etat:       etat,
	}
	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(idba, assetJSON)
}
func (s *SmartContract) ActuatorState(ctx contractapi.TransactionContextInterface, idba string) (*Bloc_Actionneur, error) {
	assetJSON, err := ctx.GetStub().GetState(idba)
	if err != nil {
		return nil, fmt.Errorf("echec de la lecture de world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf(" %s Est un utilisateur inconnu", idba)
	}

	var asset Bloc_Actionneur
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return nil, err
	}

	return &asset, nil
}
func (s *SmartContract) DeleteBlockActuatorAsset(ctx contractapi.TransactionContextInterface, idba string) error {
	exists, err := s.AssetExists(ctx, idba)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf(" %s est un bloc actionneur non existant", idba)
	}

	return ctx.GetStub().DelState(idba)
}
func (s *SmartContract) GetAllBlockactuatorAssets(ctx contractapi.TransactionContextInterface) ([]*Bloc_Actionneur, error) {

	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var assets []*Bloc_Actionneur
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var asset Bloc_Actionneur
		err = json.Unmarshal(queryResponse.Value, &asset)
		if err != nil {
			return nil, err
		}
		assets = append(assets, &asset)
	}

	return assets, nil
}

func (s *SmartContract) ReadBlockactuatorAsset(ctx contractapi.TransactionContextInterface, id string) (*Bloc_Actionneur, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("ereur de lecture dans world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf(" %s est Bloc capteur non existant", id)
	}

	var asset Bloc_Actionneur
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return nil, err
	}

	return &asset, nil
}

// Fonction pour gestion utilisateur
func (s *SmartContract) InitLedgerOwnerAsset(ctx contractapi.TransactionContextInterface) error {

	// Actif de base ba
	assets := []Proprietaire{
		{ID_p: "Admin_1234", PWD_p: "1234"},
	}

	for _, asset := range assets {
		assetJSON, err := json.Marshal(asset)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(asset.ID_p, assetJSON)
		if err != nil {
			return fmt.Errorf("impossible de mettre en place world state. %v", err)
		}
	}

	return nil
}
func (s *SmartContract) OwnerInscription(ctx contractapi.TransactionContextInterface, idp string, pwd string) error {

	exists, err := s.AssetExists(ctx, idp)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf(" %s est un utilisateur existant", idp)
	}
	asset := Proprietaire{
		ID_p:  idp,
		PWD_p: pwd,
	}
	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(idp, assetJSON)
}
func (s *SmartContract) OwnerConnexion(ctx contractapi.TransactionContextInterface, id string) (*Proprietaire, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("echec de la lecture de world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf(" %s est un utilisateur inconnu", id)
	}

	var asset Proprietaire
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return nil, err
	}

	return &asset, nil
}

// Autres fonctions
func (s *SmartContract) AssetExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return assetJSON != nil, nil
}

// Fonction Principale
func main() {
	assetChaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		log.Panicf(": %v", err)
	}

	if err := assetChaincode.Start(); err != nil {
		log.Panicf("Error starting asset-transfer-basic chaincode: %v", err)
	}
}
