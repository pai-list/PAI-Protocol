/**
 * PAI Peer Protocol (PPP) Core Types & Interfaces
 */

export type PPPMessageType = 'request' | 'response' | 'event';

export interface PPPHeader {
  proto: string;               // e.g. 'ppp/1.0'
  type: PPPMessageType;       // 'request' | 'response' | 'event'
  endpoint: string;           // e.g. 'pai://verify/kyc'
  id: string;                 // unique message ID, e.g. 'msg_01h...'
  from: string;               // DID of sender, e.g. 'did:agent:pi:agent1'
  to: string;                 // DID of recipient or '*' for broadcast
  ts: string;                 // ISO8601 UTC timestamp
  ttl?: number;               // TTL in seconds (default: 30)
  trace?: string;             // Optional distributed trace ID
  agent?: string;             // Optional agent name/version
  session?: string;           // Optional session ID for multi-turn
  lang?: string;              // Optional preferred language
}

export interface PPPBody {
  type: string;               // e.g. 'verify.kyc', 'pay.request', 'error'
  [key: string]: unknown;
}

export interface PPPErrorBody extends PPPBody {
  type: 'error';
  code: PPPErrorCode;
  message: string;
  details?: Record<string, unknown>;
  retryable: boolean;
  retry_after?: number;
}

export interface PPPReceipt {
  hash: string;               // sha256: canonical hash of Header + Body
  signature: string;          // base64 Ed25519 signature over hash
  signer: string;             // did:agent of signer
  chain_hash: string;         // TrustChain head hash
  sequence: number;           // Monotonic sequence number
  anchored: boolean;          // Anchored to Pi Network
  anchor_tx?: string;         // Pi Network transaction hash if anchored
}

export interface PPPMessage {
  header: PPPHeader;
  body: PPPBody;
  receipt?: PPPReceipt;
}

export type PPPErrorCode =
  | 'INVALID_PROTO'
  | 'INVALID_MESSAGE'
  | 'INVALID_HEADER'
  | 'INVALID_BODY'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'METHOD_NOT_ALLOWED'
  | 'RATE_LIMITED'
  | 'ENDPOINT_ERROR'
  | 'ROUTING_FAILED'
  | 'SERVICE_UNAVAILABLE'
  | 'TIMEOUT';

export interface DIDParsed {
  scheme: string;
  method: string;
  namespace?: string;
  id: string;
  raw: string;
}

export interface AgentRuntimeContract {
  wellKnown_version: string;
  runtime_version: string;
  agent: {
    id: string;
    name: string;
    version: string;
    domain: string;
  };
  identity: {
    did: string;
    issuer: string;
    sig: string;
  };
  capabilities: Array<{
    id: string;
    version: string;
    cost?: string;
    unit?: string;
  }>;
  policy: {
    payPerPrompt: number;
    payPerToken?: number | null;
    refundPolicy: string;
    reputationPolicy: string;
  };
  memory: {
    scope: string;
    persistenceDays: number;
  };
  trust: {
    anchoredTo: string;
    trustchainHandle: string;
  };
  loops: {
    attentionMining: boolean;
    computeCredit: boolean;
    moderationDAO: boolean;
    strategyVault: boolean;
  };
  proofs: {
    lastProofRef: string;
  };
}
