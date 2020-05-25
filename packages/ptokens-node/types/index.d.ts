import { EventEmitter } from 'events'

export interface NodeConfigs {
  pToken: string,
  blockchain: string
  endpoint: string
}

export class Node {
  constructor(_configs: NodeConfigs)

  pToken: string

  blockchain: string

  endpoint: string

  ping(): Promise<string>

  peers(): Promise<PeerList>

  getInfo(): Promise<NodeInfo>

  getNativeReports(_limit?: number): Promise<ReportList>

  getHostReports(_limit?: number): Promise<ReportList>

  getReportsBySenderAddress(_address: string, _limit?: number): Promise<ReportList>

  getReportsByRecipientAddress(_address: string, _limit?: number): Promise<ReportList>

  getReportsByNativeAddress(_address: string, _limit?: number): Promise<ReportList>

  getReportsByHostAddress(_address: string, _limit?: number): Promise<ReportList>

  getReportByIncomingTxHash(_hash: string): Promise<Report>

  getReportByBroadcastTxHash(_hash: string): Promise<Report>

  getNativeDepositAddress(_address: string): Promise<DepositAddress>

  getDepositAddresses(): Promise<any> // any because params are named in base of ptoken name

  getLastProcessedNativeBlock(): Promise<number>

  getLastProcessedHostBlock(): Promise<number>

  monitorIncomingTransaction(_hash: string, _eventEmitter: EventEmitter): Promise<Report>
}

export interface PeerList extends Array<Peer> {}

export interface Features extends Array<string> {}

export interface Peer {
  webapi: string,
  info: NodeInfo,
  features: Features
}

export interface NodeInfo {
  public_key: string,
  smart_contract_address: string,
  host_network: string,
  native_network: string,
  host_blockchain: string,
  native_blockchain: string,
  last_processed_host_block: number,
  last_processed_native_block: number,
}

export interface ReportList extends Array<Report> {}

export interface Report {
  _id: string,
  broadcast: true,
  broadcast_tx_hash: string,
  broadcast_timestamp: number,
  native_tx_hash?: string,
  host_tx_hash?: string,
  native_signed_tx?: string,
  host_signed_tx?: string,
  native_tx_amount?: number,
  host_tx_amount?: number,
  native_tx_recipient?: string,
  host_tx_recipient?: string,
  native_account_nonce: number,
  host_account_nonce: number,
  originating_tx_hash: string,
  originating_address: string,
  witnessed_timestamp: number,
  native_latest_block_number?: number,
  host_latest_block_number?: number
}

export interface DepositAddress {
  enclavePublicKey: string,
  nonce: number,
  nativeDepositAddress: string
}
