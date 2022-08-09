import * as vscode from 'vscode';
import * as child_process from 'child_process';
import { randomUUID } from 'crypto';

module lsp
{
	export interface Message
	{
		jsonrpc: string;
	}

	export interface RequestMessage extends Message
	{
		id: integer | string;

		method: string;

		params?: any[] | object;
	}

	export interface ResponseError
	{
		code: integer;

		message: string;

		data?: string | number | boolean | any[] | object | null;
	}

	export interface ResponseMessage extends Message
	{
		id: integer | string | null;

		result?: string | number | boolean | object | null;

		error?: ResponseError;
	}

	export namespace ErrorCodes {
		// Defined by JSON RPC
		export const PARSE_ERROR: integer = -32700;
		export const INVALID_REQUEST: integer = -32600;
		export const METHOD_NOT_FOUND: integer = -32601;
		export const INVALID_PARAMS: integer = -32602;
		export const INTERNAL_ERROR: integer = -32603;

		/**
		 * This is the start range of JSON RPC reserved error codes.
		 * It doesn't denote a real error code. No LSP error codes should
		 * be defined between the start and end range. For backwards
		 * compatibility the `ServerNotInitialized` and the `UnknownErrorCode`
		 * are left in the range.
		 *
		 * @since 3.16.0
		 */
		export const JSONRPC_RESERVED_ERROR_RANGE_START: integer = -32099;
		/** @deprecated use jsonrpcReservedErrorRangeStart */
		export const SERVER_ERROR_START: integer = JSONRPC_RESERVED_ERROR_RANGE_START;

		/**
		 * Error code indicating that a server received a notification or
		 * request before the server has received the `initialize` request.
		 */
		export const SERVER_NOT_INITIALIZED: integer = -32002;
		export const UNKNOWN_ERROR_CODE: integer = -32001;

		/**
		 * This is the end range of JSON RPC reserved error codes.
		 * It doesn't denote a real error code.
		 *
		 * @since 3.16.0
		 */
		export const JSONRPC_RESERVED_ERROR_RANGE_END = -32000;
		/** @deprecated use jsonrpcReservedErrorRangeEnd */
		export const SERVER_ERROR_END: integer = JSONRPC_RESERVED_ERROR_RANGE_END;

		/**
		 * This is the start range of LSP reserved error codes.
		 * It doesn't denote a real error code.
		 *
		 * @since 3.16.0
		 */
		export const LSP_RESERVED_ERROR_RANGE_START: integer = -32899;

		export const CONTENT_MODIFIED: integer = -32801;
		export const REQUEST_CANCELED: integer = -32800;

		/**
		 * This is the end range of LSP reserved error codes.
		 * It doesn't denote a real error code.
		 *
		 * @since 3.16.0
		 */
		export const LSP_RESERVED_ERROR_RANGE_END: integer = -32800;
	}

	export interface NotificationMessage extends Message
	{
		method: string;

		params?: any[] | object;
	}

	export interface CancelParams
	{
		id: integer | string;
	}

	export type ProgressToken = integer | string;

	export interface ProgressParams<T>
	{
		token: ProgressToken;

		value: T;
	}

	export type DocumentUri = string;
	export type URI = string;

	export interface RegularExpressionsClientCapabilities
	{
		engine: string;
		version?: string;
	}

	export interface Position
	{
		line: uinteger;
		character: uinteger;
	}

	export interface Range
	{
		start: Position;
		end: Position;
	}

	export interface Location
	{
		uri: DocumentUri;
		range: Range;
	}

	export interface LocationLink
	{
		originSelectionRange?: Range;
		targetUri: DocumentUri;
		targetRange: Range;
		targetSelectionRange: Range;
	}

	export interface StaticRegistrationOptions
	{
		id?: string;
	}

	export interface Diagnostic
	{
		range: Range;
		severity?: DiagnosticSeverity;
		code?: integer | string;
		codeDescription?: CodeDescription;
		source?: string;
		message: string;
		tags?: DiagnosticTag[];
		relatedInformation: DiagnosticRelatedInformation[];
		data?: unknown;
	}

	export namespace DiagnosticSeverity
	{
		export const ERROR: 1 = 1;
		export const WARNING: 2 = 2;
		export const INFORMATION: 3 = 3;
		export const HINT: 4 = 4;
	}

	export type DiagnosticSeverity = 1 | 2 | 3 | 4;

	export namespace DiagnosticTag
	{
		export const UNNECESSARY: 1 = 1;
		export const DEPRECATED: 2 = 2;
	}

	export type DiagnosticTag = 1 | 2;

	export interface DiagnosticRelatedInformation
	{
		location: Location;
		message: string;
	}

	export interface CodeDescription
	{
		href: URI;
	}

	export interface Command
	{
		title: string;
		command: string;
		arguments?: any[];
	}

	export interface DocumentFilter
	{
		language?: string;
		scheme?: string;
		pattern?: string;
	}

	export type DocumentSelector = DocumentFilter[];

	export interface TextDocumentIdentifier
	{
		uri: DocumentUri;
	}

	export interface TextDocumentItem
	{
		uri: DocumentUri;
		languageId: string;
		version: integer;
		text: string;
	}

	export interface TextDocumentPositionParams
	{
		textDocument: TextDocumentIdentifier;
		position: Position;
	}

	export interface VersionedTextDocumentIdentifier extends TextDocumentIdentifier
	{
		version: integer;
	}

	export interface OptionalVersionedTextDocumentIdentifier extends TextDocumentIdentifier
	{
		version: integer | null;
	}

	export interface TextDocumentRegistrationOptions
	{
		documentSelector: DocumentSelector | null;
	}

	export interface TextEdit
	{
		range: Range;
		newText: string;
	}

	export interface ChangeAnnotation
	{
		label: string;
		needsConfirmation?: boolean;
		description?: string;
	}

	export type ChangeAnnotationIdentifier = string;

	export interface AnnotatedTextEdit extends TextEdit
	{
		annotationId: ChangeAnnotationIdentifier;
	}

	export interface TextDocumentEdit
	{
		textDocument: OptionalVersionedTextDocumentIdentifier;
		edits: (TextEdit | AnnotatedTextEdit)[];
	}

	export interface CreateFileOptions
	{
		overwrite?: boolean;
		ignoreIfExists?: boolean;
	}

	export interface CreateFile
	{
		kind: 'create';
		uri: DocumentUri;
		options?: CreateFileOptions;
		annotationId: ChangeAnnotationIdentifier;
	}

	export interface RenameFileOptions
	{
		overwrite?: boolean;
		ignoreIfExists?: boolean;
	}

	export interface RenameFile
	{
		kind: 'rename';
		oldUri: DocumentUri;
		newUri: DocumentUri;
		options?: RenameFileOptions;
		annotationId?: ChangeAnnotationIdentifier;
	}

	export interface DeleteFileOptions
	{
		recursive?: boolean;
		ignoreIfNotExists?: boolean;
	}

	export interface DeleteFile
	{
		kind: 'delete';
		uri: DocumentUri;
		options?: DeleteFileOptions;
		annotationId?: ChangeAnnotationIdentifier;
	}

	export interface WorkspaceEdit
	{
		changes?: { [uri: DocumentUri]: TextEdit[]; };
		documentChanges?: (
			TextDocumentEdit[] |
			(TextDocumentEdit | CreateFile | RenameFile | DeleteFile)[]
		);
		changeAnnotations?: {
			[id: ChangeAnnotationIdentifier]: ChangeAnnotation;
		};
	}

	export type ResourceOperationKind = 'create' | 'rename' | 'delete';

	export namespace ResourceOperationKind
	{
		export const CREATE: ResourceOperationKind = 'create';
		export const RENAME: ResourceOperationKind = 'rename';
		export const DELETE: ResourceOperationKind = 'delete';
	}

	export type FailureHandlingKind = 'abort' | 'transactional' | 'undo' | 'textOnlyTransactional';

	export namespace FailureHandlingKind
	{
		export const ABORT: FailureHandlingKind = 'abort';
		export const TRANSACTIONAL: FailureHandlingKind = 'transactional';
		export const UNDO: FailureHandlingKind = 'undo';
		export const TEXT_ONLY_TRANSACTIONAL: FailureHandlingKind = 'textOnlyTransactional';
	}

	export interface WorkspaceEditClientCapabilities
	{
		documentChanges?: boolean;
		resourceOperations?: ResourceOperationKind[];
		failureHandling?: FailureHandlingKind;
		normalizeStringEnds?: boolean;
		changeAnnotationSupport?: {
			groupsOnLabel?: boolean;
		}
	}

	export interface WorkDoneProgressBegin
	{
		kind: 'begin';
		title: string;
		cancellable?: boolean;
		message?: string;
		percentage?: uinteger;
	}

	export interface WorkDoneProgressReport
	{
		kind: 'report';
		cancellable?: boolean;
		message?: string;
		percentage?: uinteger;
	}

	export interface WorkDoneprogressEnd
	{
		kind: 'end';
		message?: string;
	}

	export interface WorkDoneProgressOptions
	{
		workDoneProgress?: boolean;
	}

	export interface WorkDoneProgressParams
	{
		workDoneToken: ProgressToken;
	}

	export interface PartialResultParams
	{
		partialResultToken?: ProgressToken;
	}

	export type TraceValue = 'off' | 'message' | 'verbose';

	export interface WorkspaceFolder
	{
		uri: DocumentUri;
		name: string;
	}

	export interface FileSystemWatcher
	{
		globPattern: string;
		kind?: uinteger;
	}

	export namespace SymbolKind
	{
		export const FILE = 1;
		export const MODULE = 2;
		export const NAMESPACE = 3;
		export const PACKAGE = 4;
		export const CLASS = 5;
		export const METHOD = 6;
		export const PROPERTY = 7;
		export const FIELD = 8;
		export const CONSTRUCTOR = 9;
		export const ENUM = 10;
		export const INTERFACE = 11;
		export const FUNCTION = 12;
		export const VARIABLE = 13;
		export const CONSTANT = 14;
		export const STRING = 15;
		export const NUMBER = 16;
		export const BOOLEAN = 17;
		export const ARRAY = 18;
		export const OBJECT = 19;
		export const KEY = 20;
		export const NULL = 21;
		export const ENUM_MEMBER = 22;
		export const STRUCT = 23;
		export const EVENT = 24;
		export const OPERATOR = 25;
		export const TYPE_PARAMETER = 26;
	}

	export type SymbolKind = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
		| 11 | 12 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26;

	export namespace SymbolTag
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		export const Deprecated: 1 = 1;
	}

	export type SymbolTag = 1;

	export namespace MarkupKind
	{
		export const PLAIN_TEXT: 'plaintext' = 'plaintext';
		export const MARKDOWN: 'markdown' = 'markdown';
	}
	export type MarkupKind = 'plaintext' | 'markdown';

	export interface MarkupContent
	{
		kind: MarkupKind;
		value: string;
	}

	export interface MarkdownClientCapabilities
	{
		parser: string;
		version?: string;
	}

	export type CodeActionKind = string;

	export namespace CodeActionKind
	{
		export const EMPTY: CodeActionKind = '';
		export const QUICK_FIX: CodeActionKind = 'quickfix';
		export const REFACTOR: CodeActionKind = 'refactor';
		export const REFACTOR_EXTRACT: CodeActionKind = 'refactor.extract';
		export const REFACTOR_INLINE: CodeActionKind = 'refactor.inline';
		export const REFACTOR_REWRITE: CodeActionKind = 'refactor.rewrite';
		export const SOURCE: CodeActionKind = 'source';
		export const SOURCE_ORGANIZE_IMPORTS: CodeActionKind = 'source.organizeImports';
	}

	export namespace PrepareSupportDefaultBehavior
	{
		export const IDENTIFIER: 1 = 1;
	}

	export type PrepareSupportDefaultBehavior = 1;

	export namespace TokenFormat
	{
		export const RELATIVE: 'relative' = 'relative';
	}

	export type TokenFormat = 'relative';

	export interface DidChangeWatchedFilesRegistrationOptions
	{
		watchers: FileSystemWatcher[];
	}

	// Text Document Synchronization
	export namespace TextDocumentSyncKind
	{
		export const NONE = 0;
		export const FULL = 1;
		export const INCREMENTAL = 2;
	}

	export type TextDocumentSyncKind = 0 | 1 | 2;

	export interface TextDocumentSyncOptions
	{
		openClose?: boolean;
		change?: TextDocumentSyncKind;
	}

	export interface TextDocumentSyncClientCapabilities
	{
		dynamicRegistration?: boolean;
		willSave?: boolean;
		willSaveWaitUntil?: boolean;
		didSave?: boolean;
	}

	export interface DidOpenTextDocumentParams
	{
		textDocument: TextDocumentItem;
	}

	export interface TextDocumentChangeRegistrationOptions extends TextDocumentRegistrationOptions
	{
		syncKind: TextDocumentSyncKind;
	}

	export type TextDocumentContentChangeEvent = {
		range: Range;
		/**@deprecated use range */
		rangeLength?: uinteger;
		text: string;
	} | {
		text: string;
	};

	export interface DidChangeTextDocumentParams
	{
		textDocument: VersionedTextDocumentIdentifier;
		contentChanges: TextDocumentContentChangeEvent[];
	}

	export namespace TextDocumentSaveReason
	{
		export const MANUAL = 1;
		export const AFTER_DELAY = 2;
		export const FOCUS_OUT = 3;
	}

	export type TextDocumentSaveReason = 1 | 2 | 3;

	export interface WillSaveTextDocumentParams
	{
		textDocument: TextDocumentIdentifier;
		reason: TextDocumentSaveReason;
	}

	export interface SaveOptions
	{
		includeText?: boolean;
	}

	export interface TextDocumentSaveRegistrationOptions extends TextDocumentRegistrationOptions
	{
		includeText?: boolean;
	}

	export interface DidSaveTextDocumentParams
	{
		textDocument: TextDocumentIdentifier;
		text?: string;
	}

	export interface DidCloseTextDocumentParams
	{
		textDocument: TextDocumentIdentifier;
	}

	// Completion
	export namespace InsertTextMode
	{
		export const AS_IS: 1 = 1;
		export const ADJUST_INDENTATION: 2 = 2;
	}

	export type InsertTextMode = 1 | 2;

	export namespace CompletionItemTag
	{
		export const DEPRECATED = 1;
	}

	export type CompletionItemTag = 1;

	export namespace CompletionItemKind {
		export const TEXT = 1;
		export const METHOD = 2;
		export const FUNCTION = 3;
		export const CONSTRUCTOR = 4;
		export const FIELD = 5;
		export const VARIABLE = 6;
		export const CLASS = 7;
		export const INTERFACE = 8;
		export const MODULE = 9;
		export const PROPERTY = 10;
		export const UNIT = 11;
		export const VALUE = 12;
		export const ENUM = 13;
		export const KEYWORD = 14;
		export const SNIPPET = 15;
		export const COLOR = 16;
		export const FILE = 17;
		export const REFERENCE = 18;
		export const FOLDER = 19;
		export const EUNM_MEMBER = 20;
		export const CONSTANT = 21;
		export const STRUCT = 22;
		export const EVENT = 23;
		export const OPERATOR = 24;
		export const TYPE_PARAMETER = 25;
	}

	export type CompletionItemKind = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
		| 11 | 12 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25;

	export interface CompletionClientCapabilities
	{
		dynamicRegistration?: boolean;
		completionItem?: {
			snippetSupport?: boolean;
			commitCharactersSupport?: boolean;
			documentationFormat?: MarkupKind[];
			deprecatedSupport?: boolean;
			preselectSupport?: boolean;
			tagSupport?: {
				valueSet: CompletionItemTag[];
			}
			insertReplaceSupport?: boolean;
			resolveSupport?: {
				properties: string[];
			}
			insertTextModeSupport?: {
				valueSet: InsertTextMode[];
			}
		};
		completionItemKind?: {
			valueSet?: CompletionItemKind[];
		}
		contextSupport?: boolean;
	}

	export interface CompletionOptions extends WorkDoneProgressOptions
	{
		triggerCharacters?: string[];
		allCommitCharacters?: string[];
		resolveProvider?: boolean;
	}

	export interface CompletionRegistrationOptions extends TextDocumentRegistrationOptions, CompletionOptions
	{
	}

	export namespace CompletionTriggerKind
	{
		export const INVOKED: 1 = 1;
		export const TRIGGER_CHARACTER: 2 = 2;
		export const TRIGGER_FOR_INCOMPLETE_COMPLETIONS: 3 = 3;
	}
	export type CompletionTriggerKind = 1 | 2 | 3;

	export interface CompletionContext
	{
		triggerKind: CompletionTriggerKind;
		triggerCharacter?: string;
	}

	export interface CompletionParams extends TextDocumentPositionParams, WorkDoneProgressParams, PartialResultParams
	{
		context?: CompletionContext;
	}

	export namespace InsertTextFormat
	{
		export const PLAIN_TEXT = 1;
		export const SNIPPET = 2;
	}
	export type InsertTextFormat = 1 | 2;

	export interface InsertReplaceEdit
	{
		newText: string;
		isnert: Range;
		replace: Range;
	}

	export interface CompletionItemLabelDetails
	{
		detail?: string;
		description?: string;
	}

	export interface CompletionItem
	{
		label: string;
		labelDetails?: CompletionItemLabelDetails;
		kind?: CompletionItemKind;
		tags?: CompletionItemTag[];
		detail?: string;
		documentation?: string | MarkupContent;
		/** @deprecated in favor of tags */
		deprecated?: boolean;
		preselect?: boolean;
		sortText?: string;
		filterText?: string;
		insertText?: string;
		insertTextFormat?: InsertTextFormat;
		textEdit?: TextEdit | InsertReplaceEdit;
		additionalTextEdits?: TextEdit[];
		commitCharacters?: string[];
		command?: Command;
		data?: any;
	}

	export interface CompletionList
	{
		isIncomplete?: boolean;
		items: CompletionItem[];
	}

	// Hover
	export interface HoverClientCapabilities
	{
		dynamicRegistration?: boolean;
		contentFormat?: MarkupKind[];
	}

	export interface HoverOptions extends WorkDoneProgressOptions
	{}

	export interface HoverRegistrationOptions extends TextDocumentRegistrationOptions, HoverOptions
	{}

	export interface HoverParams extends TextDocumentPositionParams, WorkDoneProgressParams
	{}

	/**@deprecated in favor of MarkupContent */
	export type MarkedString = string | { language: string; value: string; };

	export interface Hover
	{
		contents: MarkedString | MarkedString[] | MarkupContent;
		range?: Range;
	}

	// Signature help
	export interface SignatureHelpClientCapabilities
	{
		dynamicRegistration?: boolean;
		signatureInformation?: {
			documentationFormat?: MarkupKind[];
			parameterInformation?: {
				labelOffsetSupport?: boolean;
			};
			activeParameterSupport?: boolean;
		};
		contextSupport?: boolean;
	}

	export interface SignatureHelpOptions extends WorkDoneProgressOptions
	{
		triggerCharacters?: string[];
		retriggerCharacters?: string[];
	}

	export interface SignatureHelpRegistrationOptions extends TextDocumentRegistrationOptions, SignatureHelpOptions
	{}

	export namespace SignatureHelpTriggerKind
	{
		export const INVOKED: 1 = 1;
		export const TRIGGER_CHARACTER: 2 = 2;
		export const CONTENT_CHANGE: 3 = 3;
	}
	export type SignatureHelpTriggerKind = 1 | 2 | 3;

	export interface ParameterInformation
	{
		label: string | [uinteger, uinteger];
		documentation?: string | MarkupContent;
	}

	export interface SignatureInformation
	{
		label: string;
		documentation?: string | MarkupContent;
		parameters?: ParameterInformation[];
		activeParameter?: uinteger;
	}

	export interface SignatureHelp
	{
		signatures: SignatureInformation[];
		activeSignature?: uinteger;
		activeParameter?: uinteger;
	}

	export interface SignatureHelpContext
	{
		triggerKind: SignatureHelpTriggerKind;
		triggerCharacter?: string;
		isRetrigger?: boolean;
		activeSignatureHelp?: SignatureHelp;
	}

	export interface SignatureHelpParams extends TextDocumentPositionParams, WorkDoneProgressParams
	{
		context?: SignatureHelpContext;
	}

	// Goto declaration
	export interface DeclarationClientCapabilities
	{
		dynamicRegistration?: boolean;
		linkSupport?: boolean;
	}

	export interface DeclarationOptions extends WorkDoneProgressOptions
	{}

	export interface DeclarationRegistrationOptions extends DeclarationOptions, TextDocumentRegistrationOptions, StaticRegistrationOptions
	{}

	export interface DeclarationParams extends TextDocumentPositionParams, WorkDoneProgressOptions, PartialResultParams
	{}

	//Goto definition
	export interface DefinitionClientCapabilities
	{
		dynamicRegistration?: boolean;
		linkSupport?: boolean;
	}

	export interface DefinitionOptions extends WorkDoneProgressOptions
	{}

	export interface DefinitionRegistrationOptions extends TextDocumentRegistrationOptions, DefinitionOptions
	{}

	export interface DefinitionParams extends TextDocumentPositionParams, WorkDoneProgressParams, PartialResultParams
	{}

	// Goto type definition
	export interface TypeDefinitionClientCapabilities
	{
		dynamicRegistration?: boolean;
		linkSupport?: boolean;
	}

	export interface TypeDefinitionOptions extends WorkDoneProgressOptions
	{}

	export interface TypeDefinitionRegistrationOptions extends TextDocumentRegistrationOptions, TypeDefinitionOptions, StaticRegistrationOptions
	{}

	export interface TypeDefinitionParams extends TextDocumentPositionParams, WorkDoneProgressParams, PartialResultParams
	{}

	// Goto implementation
	export interface ImplementationClientCapabilities
	{
		dynamicRegistration?: boolean;
		linkSupport?: boolean;
	}

	export interface ImplementationOptions extends WorkDoneProgressOptions
	{}

	export interface ImplementationRegistrationOptions extends TextDocumentRegistrationOptions, ImplementationOptions, StaticRegistrationOptions
	{}

	export interface ImplementationParams extends TextDocumentPositionParams, WorkDoneProgressParams, PartialResultParams
	{}

	// Reference
	export interface ReferenceClientCapabilities
	{
		dynamicRegistration?: boolean;
	}

	export interface ReferenceOptions extends WorkDoneProgressOptions
	{}

	export interface ReferenceRegistrationOptions extends TextDocumentRegistrationOptions, ReferenceOptions
	{}

	export interface ReferenceContext
	{
		includeDeclaration: boolean;
	}

	export interface ReferenceParams extends TextDocumentPositionParams, WorkDoneProgressParams, PartialResultParams
	{
		context: ReferenceContext;
	}

	// Document highlight
	export interface DocumentHighlightClientCapabilities
	{
		dynamicRegistration?: boolean;
	}

	export interface DocumentHighlightOptions extends WorkDoneProgressOptions
	{}

	export interface DocumentHighlightRegistrationOptions extends TextDocumentRegistrationOptions, DocumentHighlightOptions
	{}

	export interface DocumentHighlightParams extends TextDocumentPositionParams, WorkDoneProgressParams, PartialResultParams
	{}

	export namespace DocumentHighlightKind
	{
		export const TEXT = 1;
		export const READ = 2;
		export const WRITE = 3;
	}
	export type DocumentHighlightKind = 1 | 2 | 3;

	export interface DocumentHighlight
	{
		range: Range;
		kind?: DocumentHighlightKind;
	}

	// Document symbol
	export interface DocumentSymbolClientCapabilities
	{
		dynamiRegistration?: boolean;
		symbolKind?: {
			valueSet?: SymbolKind[];
		}
		hierarchicalDocumentSymbolSupport?: boolean;
		tagSupport?: {
			valueSet: SymbolTag[];
		}
		labelSupport?: boolean;
	}

	export interface DocumentSymbolOptions extends WorkDoneProgressOptions
	{
		label?: string;
	}

	export interface DocumentSymbolParams extends WorkDoneProgressParams, PartialResultParams
	{
		textDocument: TextDocumentIdentifier;
	}

	export interface DocumentSymbol
	{
		name: string;
		detail?: string;
		kind: SymbolKind;
		tags: SymbolTag[];
		/**@deprecated use tags */
		deprecated?: boolean;
		range: Range;
		selectionRange?: Range;
		children?: DocumentSymbol[];
	}

	/**@deprecated Use DocumentSymbol */
	export interface SymbolInformation
	{
		name: string;
		kind: SymbolKind;
		tags?: SymbolTag[];
		/**@deprecated use tags */
		deprecated?: boolean;
		location: Location;
		containerName?: string;
	}

	// Code action
	export interface CodeActionClientCapabilities
	{
		dynamicRegistration?: boolean;
		codeActionLiteralSupport?: {
			codeActionKind: {
				valueSet: CodeActionKind[];
			};
		};
		isPrefferedSupport?: boolean;
		disabledSuport?: boolean;
		dataSupport?: boolean;
		resolveSupport?: {
			properties: string[];
		};
		honorsChangeAnnotations?: boolean;
	}

	export interface CodeActionOptions extends WorkDoneProgressOptions
	{
		codeActionKinds?: CodeActionKind[];
		resolveProvider?: boolean;
	}

	export interface CodeActionRegistrationOptions extends TextDocumentRegistrationOptions, CodeActionOptions
	{}

	export namespace CodeActionTriggerKind
	{
		export const INVOKED: 1 = 1;
		export const AUTOMATIC: 2 = 2;
	}
	export type CodeActionTriggerKind = 1 | 2;

	export interface CodeActionContext
	{
		diagnostic: Diagnostic[];
		only?: CodeActionKind[];
	}

	export interface CodeActionParams extends WorkDoneProgressParams, PartialResultParams
	{
		textDocument: TextDocumentIdentifier;
		range: Range;
		context: CodeActionContext;
	}

	export interface CodeAction
	{
		title: string;
		kind?: CodeActionKind;
		diagnostics?: Diagnostic[];
		isPreferred?: boolean;
		disabled?: {
			reason: string;
		}
		edit?: WorkspaceEdit;
		command?: Command;
		data?: any;
	}

	// Code lens
	export interface CodeLensClientCapabilities
	{
		dynamicRegistration?: boolean;
	}

	export interface CodeLensOptions extends WorkDoneProgressOptions
	{
		resolveProvider?: boolean;
	}

	export interface CodeLensRegistrationOptions extends TextDocumentRegistrationOptions, CodeLensOptions
	{}

	export interface CodeLensParams extends WorkDoneProgressParams, PartialResultParams
	{
		textDocument: TextDocumentIdentifier;
	}

	export interface CodeLens
	{
		range?: Range;
		command?: Command;
		data?: any;
	}

	export interface CodeLensWorkspaceClientCapabilities
	{
		refreshSupport?: boolean;
	}

	// Document link
	export interface DocumentLinkClientCapabilities
	{
		dynamicRegistration?: boolean;
		tooltipSupport?: boolean;
	}

	export interface DocumentLinkOptions extends WorkDoneProgressOptions
	{
		resolveProvider?: boolean;
	}

	export interface DocumentLinkRegistrationOptions extends TextDocumentRegistrationOptions, DocumentLinkOptions
	{}

	export interface DocumentLinkParams extends WorkDoneProgressParams, PartialResultParams
	{
		textDocument: TextDocumentIdentifier;
	}

	export interface DocumentLink
	{
		range: Range;
		target?: DocumentUri;
		tooltip?: string;
		data?: any;
	}

	// Document color
	export interface DocumentColorClientCapabilities
	{
		dynamicRegistration?: boolean;
	}

	export interface DocumentColorOptions extends WorkDoneProgressOptions
	{}

	export interface DocumentColorRegistrationOptions extends
		TextDocumentRegistrationOptions, StaticRegistrationOptions,
		DocumentColorOptions
	{}

	export interface DocumentColorParams extends WorkDoneProgressParams, PartialResultParams
	{
		textDocument: TextDocumentIdentifier;
	}

	export interface Color
	{
		readonly red: decimal;
		readonly green: decimal;
		readonly blue: decimal;
		readonly alpha: decimal;
	}

	export interface ColorInformation
	{
		range: Range;
		color: Color;
	}

	// Document formatting
	export interface DocumentFormattingClientCapabilities
	{
		dynamicRegistration?: boolean;
	}

	export interface DocumentFormattingOptions extends WorkDoneProgressOptions
	{}

	export interface DocumentFormattingRegistrationOptions extends DocumentFormattingOptions, TextDocumentRegistrationOptions
	{}

	export interface FormattingOptions
	{
		tabSize: uinteger;
		insertSpaces: boolean;
		trimTraillingWhitespace?: boolean;
		insertFinalNewline?: boolean;
		trimFinalNewlines?: boolean;
	}

	// Document range formatting
	export interface DocumentRangeFormattingClientCapabilities
	{
		dynamicRegistration?: boolean;
	}

	export interface DocumentRangeFormattingOptions extends WorkDoneProgressOptions
	{}

	export interface DocumentRangeFormattingRegistrationOptions extends DocumentRangeFormattingOptions, TextDocumentRegistrationOptions
	{}

	export interface DocumentRangeFormattingParams extends WorkDoneProgressParams
	{
		textDocument: TextDocumentIdentifier;
		options: FormattingOptions;
	}

	// Document on-type formatting
	export interface DocumentOnTypeFormattingClientCapabilities
	{
		dynamicRegistration?: boolean;
	}

	export interface DocumentOnTypeFormattingOptions
	{
		firstTriggerCharacter: string;
		moreTriggerCharacters?: string[];
	}

	export interface DocumentOnTypeFormattingRegistrationOptions extends DocumentOnTypeFormattingOptions, TextDocumentRegistrationOptions
	{}

	export interface DocumentOnTypeFormattingParams extends WorkDoneProgressParams
	{
		ch: string;
		options: FormattingOptions;
	}

	// Rename
	export interface RenameClientCapabilities
	{
		dynamicRegistration?: boolean;
		prepareSupport?: boolean;
		prepareSupportDefaultBehavior?: PrepareSupportDefaultBehavior;
		honorsChangeAnnotations?: boolean;
	}

	export interface RenameOptions extends WorkDoneProgressOptions
	{
		prepareProvider?: boolean;
	}

	export interface RenameRegistrationOptions extends
		TextDocumentRegistrationOptions, RenameOptions {
	}

	export interface RenameParams extends TextDocumentPositionParams, WorkDoneProgressParams
	{
		newName: string;
	}

	export interface PrepareRenameParams extends TextDocumentPositionParams
	{}

	// Folding range
	export interface FoldingRangeClientCapabilities
	{
		dynamicRegistration?: boolean;
		rangeLimit?: uinteger;
		lineFoldingOnly?: boolean;
	}

	export interface FoldingRangeOptions extends WorkDoneProgressOptions {
	}

	export interface FoldingRangeRegistrationOptions extends
		TextDocumentRegistrationOptions, FoldingRangeOptions,
		StaticRegistrationOptions {
	}

	export interface FoldingRangeParams extends WorkDoneProgressParams,
		PartialResultParams {
		textDocument: TextDocumentIdentifier;
	}

	export enum FoldingRangeKind
	{
		comment = "comment",
		imports = "imports",
		region = "region"
	}

	export interface FoldingRange
	{
		startLine: uinteger;
		endLine: uinteger;
		endCharacter?: uinteger;
		kind?: string;
	}

	// Selection range
	export interface SelectionRangeClientCapabilities
	{
		dynamicRegistration?: boolean;
	}

	export interface SelectionRangeOptions extends WorkDoneProgressOptions {
	}

	export interface SelectionRangeRegistrationOptions extends
		SelectionRangeOptions, TextDocumentRegistrationOptions,
		StaticRegistrationOptions {
	}

	export interface SelectionRangeParams extends WorkDoneProgressParams, PartialResultParams
	{
		textDocument: TextDocumentIdentifier;
		positions: Position[];
	}

	export interface SelectionRange
	{
		range: Range;
		parent?: SelectionRange;
	}

	// Execute command
	export interface ExecuteCommandClientCapabilities
	{
		dynamicRegistration?: boolean;
	}

	export interface ExecuteCommandOptions extends WorkDoneProgressOptions
	{
		commands: string[];
	}

	export interface ExecuteCommandRegistrationOptions
		extends ExecuteCommandOptions {
	}

	export interface ExecuteCommandParams extends WorkDoneProgressParams
	{
		command: string;
		arguments?: any[];
	}

	// Linked range editing
	export interface LinkedEditingRangeClientCapabilities
	{
		dynamicRegistration?: boolean;
	}

	export interface LinkedEditingRangeOptions extends WorkDoneProgressOptions {
	}

	export interface LinkedEditingRangeRegistrationOptions extends
		TextDocumentRegistrationOptions, LinkedEditingRangeOptions,
		StaticRegistrationOptions {
	}

	export interface LinkedEditingRangeParams extends TextDocumentPositionParams,
		WorkDoneProgressParams {
	}

	export interface LinkedEditingRanges
	{
		ranges: Range[];
		wordPattern?: string;
	}

	// Call hierarchy
	export interface CallHierarchyClientCapabilities
	{
		dynamicRegistration?: boolean;
	}

	export interface CallHierarchyOptions extends WorkDoneProgressOptions {
	}

	export interface CallHierarchyRegistrationOptions extends
		TextDocumentRegistrationOptions, CallHierarchyOptions,
		StaticRegistrationOptions {
	}

	export interface CallHierarchyPrepareParams extends TextDocumentPositionParams,
		WorkDoneProgressParams {
	}

	export interface CallHierarchyItem
	{
		name: string;
		kind: SymbolKind;
		tags?: SymbolTag[];
		detail?: string;
		uri: DocumentUri;
		range: Range;
		selectionRange: Range;
		data?: unknown;
	}

	export interface CallHierarchyIncomingCallParams extends WorkDoneProgressParams, PartialResultParams
	{
		item: CallHierarchyItem;
	}

	export interface CallHierarchyIncomingCall
	{
		from: CallHierarchyItem;
		fromRanges: Range[];
	}

	export interface CallHierarchyOutgoingCallParams extends WorkDoneProgressParams, PartialResultParams
	{
		item: CallHierarchyItem;
	}

	export interface CallHierarchyOutgoingCall
	{
		to: CallHierarchyItem;
		fromRanges: Range[];
	}

	// Semantic tokens
	export enum SemanticTokenTypes {
		namespace = 'namespace',
		type = 'type',
		class = 'class',
		enum = 'enum',
		interface = 'interface',
		struct = 'struct',
		typeParameter = 'typeParameter',
		parameter = 'parameter',
		variable = 'variable',
		property = 'property',
		enumMember = 'enumMember',
		event = 'event',
		function = 'function',
		method = 'method',
		macro = 'macro',
		keyword = 'keyword',
		modifier = 'modifier',
		comment = 'comment',
		string = 'string',
		number = 'number',
		regexp = 'regexp',
		operator = 'operator'
	}

	export enum SemanticTokenModifiers {
		declaration = 'declaration',
		definition = 'definition',
		readonly = 'readonly',
		static = 'static',
		deprecated = 'deprecated',
		abstract = 'abstract',
		async = 'async',
		modification = 'modification',
		documentation = 'documentation',
		defaultLibrary = 'defaultLibrary'
	}

	export interface SemanticTokensLegend
	{
		tokenTypes: string[];
		tokenModifiers: string[];
	}

	export interface SemanticTokensClientCapabilities
	{
		dynamicRegistration?: boolean;
		requests: {
			range?: boolean | {
			};

			full?: boolean | {
				delta?: boolean;
			};
		};
		tokenTypes: string[];
		tokenModifiers: string[];
		formats: TokenFormat[];
		overlappingTokenSupport?: boolean;
		multilineTokenSupport?: boolean;
	}

	export interface SemanticTokensOptions extends WorkDoneProgressOptions
	{
		legend: SemanticTokensLegend;
		range?: boolean | {};
		full?: boolean | {
			delta?: boolean;
		};
	}

	export interface SemanticTokensRegistrationOptions extends
		TextDocumentRegistrationOptions, SemanticTokensOptions,
		StaticRegistrationOptions {
	}

	export interface SemanticTokensParams extends WorkDoneProgressParams, PartialResultParams
	{
		textDocument: TextDocumentIdentifier;
	}

	export interface SemanticTokens
	{
		resultId?: string;
		data: uinteger[];
	}

	export interface SemanticTokensPartialResult
	{
		data: uinteger[];
	}

	export interface SemanticTokensDeltaParams extends WorkDoneProgressParams, PartialResultParams
	{
		textDocument: TextDocumentIdentifier;
		previousResultId: string;
	}

	export interface SemanticTokensEdit
	{
		start: uinteger;
		deleteCount: uinteger;
		data?: uinteger[];
	}

	export interface SemanticTokensDelta
	{
		readonly resultId?: string;
		edits: SemanticTokensEdit[];
	}

	export interface SemanticTokensDeltaPartialResult
	{
		edits: SemanticTokensEdit;
	}

	export interface SemanticTokensRangeParams extends WorkDoneProgressParams, PartialResultParams
	{
		textDocument: TextDocumentIdentifier;
		range: Range;
	}

	export interface SemanticTokensWorkspaceClientCapabilities
	{
		refreshSupport?: boolean;
	}

	// Monikers
	export interface MonikerClientCapabilities
	{
		dynamicRegistration?: boolean;
	}

	export interface MonikerOptions extends WorkDoneProgressOptions {
	}

	export interface MonikerRegistrationOptions extends
		TextDocumentRegistrationOptions, MonikerOptions {
	}

	export interface MonikerParams extends TextDocumentPositionParams,
		WorkDoneProgressParams, PartialResultParams {
	}

	export enum UniquenessLevel
	{
		document = 'document',
		project = 'project',
		group = 'group',
		scheme = 'scheme',
		global = 'global'
	}

	export enum MonikerKind
	{
		import = 'import',
		export = 'export',
		local = 'local'
	}

	export interface Moniker
	{
		scheme: string;
		identifier: string;
		unique: UniquenessLevel;
		kind?: MonikerKind;
	}

	// Workspace symbols
	export interface WorkspaceSymbolClientCapabilities
	{
		dynamicRegistration?: boolean;

		symbolKind?: {
			valueSet?: SymbolKind[];
		}

		tagSupport?: {
			valueSet: SymbolTag;
		}
	}

	export interface WorkspaceSymbolOptions extends WorkDoneProgressOptions
	{}

	export interface WorkspaceSymbolRegistrationOptions
		extends WorkspaceSymbolOptions {
	}

	export interface WorkspaceSymbolParams extends WorkDoneProgressParams, PartialResultParams
	{
		query: string;
	}

	// Workspace folders
	export interface WorkspaceFoldersServerCapabilities
	{
		supported?: boolean;
		changeNotifications?: string | boolean;
	}

	export interface WorkspaceFolderChangeEvent
	{
		added: WorkspaceFolder[];
		removed: WorkspaceFolder[];
	}

	export interface DidChangeWorkspaceFoldersParams
	{
		event: WorkspaceFolderChangeEvent;
	}

	// File operations
	export namespace FileOperationPatternKind
	{
		export const file: 'file' = 'file';
		export const folder: 'folder' = 'folder';
	}

	export type FileOperationPatternKind = 'file' | 'folder';

	export interface FileOperationPatternOptions
	{
		ignoreCase?: boolean;
	}

	export interface FileOperationPattern
	{
		glob: string;
		matches?: FileOperationPatternKind;
		options?: FileOperationPatternOptions;
	}

	export interface FileOperationFilter
	{
		scheme?: string;
		pattern: FileOperationPattern;
	}

	export interface FileOperationRegistrationOptions
	{
		filters: FileOperationFilter[];
	}

	export interface FileCreate
	{
		uri: string;
	}

	export interface FileCreateOptions
	{
		files: FileCreate[];
	}

	export interface FileRename
	{
		oldUri: string;
		newUri: string;
	}

	export interface FileRenameOptions
	{
		files: FileRename[];
	}

	export interface FileDelete
	{
		uri: string;
	}

	export interface FileDeleteOptions
	{
		files: FileDelete[];
	}

	// File watcher
	export interface DidChangeWatchedFilesClientCapabilities
	{
		dynamicRegistration?: boolean;
	}

	export namespace WatchKind
	{
		export const CREATE = 1;
		export const CHANGE = 2;
		export const DELETE = 4;
	}

	export interface FileEvent
	{
		uri: DocumentUri;
		type: uinteger;
	}

	export interface DidChangeWatchedFilesParams
	{
		changes: FileEvent;
	}

	export namespace FileChangeType
	{
		export const CREATED = 1;
		export const CHANGED = 2;
		export const DELETED = 3;
	}

	export interface DidChangeConfigurationClientCapabilities
	{
		dynamicRegistraction?: boolean;
	}

	export interface PublishDiagnosticsParams
	{
		uri: DocumentUri;
		version?: integer;
		diagnostics: Diagnostic[];
	}

	export interface PublishDiagnosticsClientCapabilities
	{
		relatedInformation?: boolean;
		tagSupport?: {
			valueSet: DiagnosticTag[];
		}
		versionSupport?: boolean;
		codeDescriptionSupport?: boolean;
		dataSupport?: boolean;
	}

	export interface TypeHierarchyClientCapabilities
	{
		dynamicRegistration?: boolean;
	}

	export interface InlineValueClientCapabilities
	{
		dynamicRegistration?: boolean;
	}

	export interface InlayHintClientCapabilities
	{
		dynamicRegistration?: boolean;
		resolveSupport?: {
			properties: string[];
		}
	}

	export interface ShowMessageRequestClientcapabilities
	{
		messageActionItem?: {
			additionalPropertiesSupport?: boolean;
		}
	}

	export interface TextDocumentClientCapabilities
	{
		synchronization?: TextDocumentSyncClientCapabilities;
		completion?: CompletionClientCapabilities;
		hover?: HoverClientCapabilities;
		signatureHelp?: SignatureHelpClientCapabilities;
		declaration?: DeclarationClientCapabilities;
		definition?: DefinitionClientCapabilities;
		typeDefinition?: TypeDefinitionClientCapabilities;
		implementation?: ImplementationClientCapabilities;
		references?: ReferenceClientCapabilities;
		documentHighlight?: DocumentHighlightClientCapabilities;
		documentSymbol?: DocumentSymbolClientCapabilities;
		codeAction?: CodeActionClientCapabilities;
		codeLens?: CodeLensClientCapabilities;
		documentLink?: DocumentLinkClientCapabilities;
		colorProvider?: DocumentColorClientCapabilities;
		formatting?: DocumentFormattingClientCapabilities;
		rangeFormatting?: DocumentRangeFormattingClientCapabilities;
		onTypeFormatting?: DocumentOnTypeFormattingClientCapabilities;
		rename?: RenameClientCapabilities;
		publishDiagnostics?: PublishDiagnosticsClientCapabilities;
		foldingRange?: FoldingRangeClientCapabilities;
		selectionRange?: SelectionRangeClientCapabilities;
		linkedEditingRange?: LinkedEditingRangeClientCapabilities;
		callHierarchy?: CallHierarchyClientCapabilities;
		semanticTokens?: SemanticTokensClientCapabilities;
		moniker?: MonikerClientCapabilities;
	}

	export interface ShowDocumentRequestClientCapabilities
	{
		support: boolean;
	}

	export interface ClientCapabilities
	{
		workspace?: {
			applyEdit?: boolean;
			workspaceEdit?: WorkspaceEditClientCapabilities;
			didChangeConfiguration?: boolean;
			didChangeWatchedFiles?: DidChangeWatchedFilesRegistrationOptions;
			symbol?: WorkspaceSymbolClientCapabilities;
			executeCommand?: ExecuteCommandClientCapabilities;
			workspaceFolders?: boolean;
			configuration?: boolean;
			semanticTokens?: SemanticTokensWorkspaceClientCapabilities;
			codeLens?: CodeLensWorkspaceClientCapabilities;
			fileOperations?: {
				dynamicRegistration?: boolean;
				didCreate?: boolean;
				willCreate?: boolean;
				didRename?: boolean;
				willRename?: boolean;
				didDelete?: boolean;
				willDelete?: boolean;
			};
			textDocument?: TextDocumentClientCapabilities;
			window?: {
				workDoneProgress?: boolean;
				showMessage?: ShowMessageRequestClientcapabilities;
				showDocument?: ShowDocumentRequestClientCapabilities;
			};
			general?: {
				regularExpressions?: RegularExpressionsClientCapabilities;
				markdown?: MarkdownClientCapabilities;
			}
		};
		experimental?: any;
	}

	export interface ServerCapabilities
	{
		textDocumentSync?: TextDocumentSyncOptions | TextDocumentSyncKind;
		completionProvider?: CompletionOptions;
		hoverProvider?: boolean | HoverOptions;
		signatureHelpProvider?: SignatureHelpOptions;
		declarationProvider?: boolean | DeclarationOptions | DeclarationRegistrationOptions;
		definitionProvider?: boolean | DefinitionOptions;
		typeDefinitionProvider?: boolean | TypeDefinitionOptions | TypeDefinitionRegistrationOptions;
		implementationProvider?: boolean | ImplementationOptions | ImplementationRegistrationOptions;
		referencesProvider?: boolean | ReferenceOptions;
		documentHighlightProvider?: boolean | DocumentHighlightOptions;
		documentSymbolProvider?: boolean | DocumentSymbolOptions;
		codeActionProvider?: boolean | CodeActionOptions;
		codeLensProvider?: CodeLensOptions;
		documentLinkOptions?: DocumentLinkOptions;
		colorProvider?: boolean | DocumentColorOptions | DocumentColorRegistrationOptions;
		documentFormattingProvider?: boolean | DocumentFormattingOptions;
		documentRangeFormattingProvider?: boolean | DocumentRangeFormattingOptions;
		documentOnTypeFormattingProvider?: boolean | DocumentOnTypeFormattingOptions;
		renameProvider?: boolean | RenameOptions;
		foldingRangeProvider?: boolean | FoldingRangeOptions | FoldingRangeRegistrationOptions;
		executeCommandProvider?: ExecuteCommandOptions;
		selectionRangeProvider?: boolean | SelectionRangeOptions | SelectionRangeRegistrationOptions;
		linkedEditingRangeProvider?: boolean | LinkedEditingRangeOptions | LinkedEditingRangeRegistrationOptions;
		callHierarchyProvider?: boolean | CallHierarchyOptions | CallHierarchyRegistrationOptions;
		semanticTokensProvider?: SemanticTokensOptions | SemanticTokensRegistrationOptions;
		monikerProvider?: boolean | MonikerOptions | MonikerRegistrationOptions;
		workspaceSymbolProvider?: boolean | WorkspaceSymbolOptions;
		workspace?: {
			workspaceFolders?: WorkspaceFoldersServerCapabilities;
			fileOperations?: {
				didCreate?: FileOperationRegistrationOptions;
				willCreate?: FileOperationRegistrationOptions;
				didRename?: FileOperationRegistrationOptions;
				willRename?: FileOperationRegistrationOptions;
				didDelete?: FileOperationRegistrationOptions;
				willDelete?: FileOperationRegistrationOptions;
			};
		};
		experimental?: any;
	}

	// Initialize
	export interface InitializeParams extends WorkDoneProgressParams
	{
		processId: integer | null;
		clientInfo?: {
			name: string;
			version?: string;
		}

		locale?: string;
		/** @deprecated: Use rootUri */
		rootPath: string | null;
		/** @deprecated: Use workspaceFolders */
		rootUri: DocumentUri | null;

		initializationOptions?: any;

		capabilities: ClientCapabilities;
		trace?: TraceValue;

		workspaceFolders?: WorkspaceFolder[];
	}

	export interface InitializeResult
	{
		capabilities: ServerCapabilities;
		serverInfo?: {
			name: string;
			version?: string;
		}
	}

	export namespace InitializeError
	{
		/** @deprecated in favor of client capabilities */
		export const unknownProtocolVersion: 1 = 1;
	}

	export interface InitializeError
	{
		retry: boolean;
	}

	// Log trace
	export interface LogTraceParams
	{
		message: string;
		verbose?: string;
	}

	export interface SetTraceParams
	{
		value: TraceValue;
	}

	// Show message
	export namespace MessageType
	{
		export const ERROR = 1;
		export const WARNING = 2;
		export const INFO = 3;
		export const LOG = 4;
	}
	export type MessageType = 1 | 2 | 3 | 4;

	export interface ShowMessageParams
	{
		type: MessageType;
		message: string;
	}

	export interface MessageActionItem
	{
		title: string;
	}

	export interface ShowMessageRequestParams
	{
		type: MessageType;
		message: string;
		actions?: MessageActionItem[];
	}

	// Show Document
	export interface ShowDocumentParams
	{
		uri: URI;
		external?: boolean;
		takeFocus?: boolean;
		selection?: Range;
	}

	export interface ShowDocumentResult
	{
		success: boolean;
	}

	// Log message
	export interface LogMessageParams
	{
		type: MessageType;
		message: string;
	}

	// Work done progress
	export interface WorkDoneProgressCreateParams
	{
		token: ProgressToken;
	}

	export interface WorkDoneProgressCancelParams
	{
		token: ProgressToken;
	}

	// Registration
	export interface Registration
	{
		id: string;
		method: string;
		registerOptions?: any;
	}

	export interface RegistrationParams
	{
		registrations: Registration[];
	}

	export interface Unregistration
	{
		id: string;
		method: string;
	}

	export interface UnregistrationParams
	{
		unregistrations: Unregistration[];
	}

	// Configuration
	export interface ConfigurationItem
	{
		scopeUri?: DocumentUri;
		section?: string;
	}

	export interface ConfigurationParams
	{
		items: ConfigurationItem;
	}

	// Workspace edit
	export interface ApplyWorkspaceEditParams
	{
		label?: string;
		edit: WorkspaceEdit;
	}

	export interface ApplyWorkspaceEditResponse
	{
		applied: boolean;
		failureReason?: string;
		failedChange?: uinteger;
	}
}
// eslint-disable-next-line @typescript-eslint/naming-convention
export type integer = number;
// eslint-disable-next-line @typescript-eslint/naming-convention
export type uinteger = number;
// eslint-disable-next-line @typescript-eslint/naming-convention
export type decimal = number;

interface ClientResponse
{
	result?: any;
	error?: lsp.ResponseError;
}

let diagnosticCollectionLua: vscode.DiagnosticCollection;

const contentLength: integer = "Content-Length: ".length;
let readLength: integer = 0;
let msgStage = 0;
let lastMsgId: integer = 0;
let received: string = "";
let awaitLength: integer = 0;

let traceOutput: vscode.OutputChannel;

let notificationListeners: Map<string, (params?: any[] | object) => void> = new Map<string, () => void>();
let requestListeners: Map<string, (params?: any[] | object) =>ClientResponse> = new Map<string, (params?: any[] | object) =>ClientResponse>();
let responseListeners: Map<string, (request : lsp.RequestMessage, respomse?: lsp.ResponseMessage) => boolean>
	= new Map<string, (request : lsp.RequestMessage, response?: lsp.ResponseMessage) => boolean>();

let pendingRequests: Map<integer | string, lsp.RequestMessage> = new Map<integer | string, lsp.RequestMessage>();

const _DEBUG = true;

let config = vscode.workspace.getConfiguration("fmodsilo");
let path: string | undefined = config.get("serverExecutablePath");
let fserver: child_process.ChildProcess;

async function sendRequest(method: string, params?: any[] | object)
{
	let msg: lsp.RequestMessage = <lsp.RequestMessage>{};
	msg.id = randomUUID();
	msg.jsonrpc = "2.0";
	msg.method = method;
	msg.params = params;

	pendingRequests.set(msg.id, msg);

	let msgStr = JSON.stringify(msg);
	let fullStr = "Content-Length: " + msgStr.length + "\r\n\r\n" + msgStr;
	fserver.stdin?.write(fullStr);
}

async function sendNotification(method: string, params?: any[] | object)
{
	let msg: lsp.NotificationMessage = <lsp.NotificationMessage>{};
	msg.jsonrpc = "2.0";
	msg.method = method;
	msg.params = params;

	let msgStr = JSON.stringify(msg);
	let fullStr = "Content-Length: " + msgStr.length + "\r\n\r\n" + msgStr;
	fserver.stdin?.write(fullStr);
}

async function sendResponse(request: lsp.RequestMessage,  result?: object, error?: lsp.ResponseError)
{
	let msg: lsp.ResponseMessage = <lsp.ResponseMessage>{};
	msg.error = error;
	msg.id = request.id;
	msg.jsonrpc = "2.0";
	msg.result = result;

	let msgStr = JSON.stringify(msg);
	let fullStr = "Content-Length: " + msgStr.length + "\r\n\r\n" + msgStr;
	fserver.stdin?.write(fullStr);
}

async function interpretMessage(obj: object)
{
	if ('method' in obj)
	{
		if ('id' in obj)
		{
			// It's a request
			const request: lsp.RequestMessage = obj as lsp.RequestMessage;
			let fn = requestListeners.get(request.method);
			if (fn !== undefined)
			{
				let obj: ClientResponse = fn(request.params);
				sendResponse(request, obj.result, obj.error);
			}
			else
			{
				sendResponse(request, undefined, <lsp.ResponseError>{
					code: lsp.ErrorCodes.METHOD_NOT_FOUND,
					message: "Method " + request.method + " not found.",
				});
			}
		}
		else
		{
			// It's a notification
			const notification: lsp.NotificationMessage = obj as lsp.NotificationMessage;
			let fn = notificationListeners.get(notification.method);
			if (fn !== undefined) {
				fn(notification.params);
			}
		}
	}
	else
	{
		// It's a response
		const response: lsp.ResponseMessage = obj as lsp.ResponseMessage;
		if (response.id !== null)
		{
			const request = pendingRequests.get(response.id);

			if (request !== undefined)
			{
				let fn = responseListeners.get(request.method);
				if (fn !== undefined)
				{
					let shouldRemove: boolean = fn(request, response);
					if (shouldRemove)
					{
						pendingRequests.delete(response.id);
					}
				}
			}
			else
			{
				vscode.window.showErrorMessage("Pending request not found.");
			}
		}
		else
		{
			console.log(obj);
			vscode.window.showErrorMessage("Missing id field form response.");
		}
	}
}

function onMessageReceived(data: string)
{
	let beginIndex: integer = 0;

mainwhile:
	while (beginIndex < data.length)
	{
		if (msgStage === 0)
		{
			for (let i = beginIndex; i < data.length; i++) {
				const c = data[i];
				if (c === '\n')
				{
					awaitLength = +received.substring(contentLength, received.length-1);
					beginIndex = i+1;
					received = "";
					msgStage = 1;
					continue mainwhile;
				}
				else
				{
					received += c;
				}
			}
			beginIndex = data.length;
		}
		else if (msgStage === 1)
		{
			for (let i = beginIndex; i < data.length; i++) {
				const c = data[i];
				if (c === '\n')
				{
					beginIndex = i+1;
					if (received.length === 1)
					{
						received = "";
						msgStage = 2;
						continue mainwhile;
					}

					received = "";
				}
				else
				{
					received += c;
				}
			}

			beginIndex = data.length;
		}
		else if (msgStage === 2)
		{
			for (let i = beginIndex; i < data.length; i++) {
				const c = data[i];
				readLength++;
				received += c;
				if (readLength === awaitLength)
				{
					beginIndex = i+1;
					msgStage = 0;
					readLength = 0;

					// Parse and react
					interpretMessage(JSON.parse(received));

					received = "";
					continue mainwhile;
				}
			}

			beginIndex = data.length;
		}
	}
}

let serverCababilities: lsp.ServerCapabilities;

function onInitializeResponse(request: lsp.RequestMessage, response?: lsp.ResponseMessage): boolean
{
	let result = response?.result as lsp.InitializeResult;
	if (result)
	{
		serverCababilities = result.capabilities;

		if (serverCababilities.workspace?.workspaceFolders?.changeNotifications)
		{
			vscode.workspace.onDidChangeWorkspaceFolders((e: vscode.WorkspaceFoldersChangeEvent) => {
				let params: lsp.DidChangeWorkspaceFoldersParams = <lsp.DidChangeWorkspaceFoldersParams>{};
				params.event = <lsp.WorkspaceFolderChangeEvent>{};
				params.event.added = [];
				params.event.removed = [];
				
				for (let i = 0; i < e.added.length; i++)
				{
					params.event.added[i] = <lsp.WorkspaceFolder>{
						uri: e.added[i].uri.toString(),
						name: e.added[i].name
					};
				}
			
				for (let i = 0; i < e.removed.length; i++)
				{
					params.event.removed[i] = <lsp.WorkspaceFolder>{
						uri: e.removed[i].uri.toString(),
						name: e.removed[i].name
					};
				}

				sendNotification("workspace/didChangeWorkspaceFolders", params);
			});
		}

		sendNotification("initialized", {});
		vscode.window.showInformationMessage("FModSilo initialized!");
	}
	return true;
}

function onShutdownResponse(request: lsp.RequestMessage, response?: lsp.ResponseMessage): boolean
{
	sendNotification("exit", {});
	return true;
}

function onPublishDiagnosticsNotification(params: any[] | object | undefined)
{
	let diagnostics: lsp.PublishDiagnosticsParams = params as lsp.PublishDiagnosticsParams;
	let vscodeDiagnostics: vscode.Diagnostic[] = [];

	diagnostics.diagnostics.forEach(diagnostic => {
		let vd: vscode.Diagnostic = <vscode.Diagnostic>{
			code: diagnostic.code,
			message: diagnostic.message,
			range: diagnostic.range as vscode.Range,
			severity: 0,
			source: diagnostic.source
		};

		if (diagnostic.severity !== undefined)
		{
			vd.severity = diagnostic.severity - 1;
		}

		vscodeDiagnostics.push(vd);
	});

	diagnosticCollectionLua.set(vscode.Uri.file(diagnostics.uri), vscodeDiagnostics);
}

function onLogTraceNotification(params: any[] | object | undefined)
{
	let msg = params as lsp.LogTraceParams;

	traceOutput.appendLine("trace: " + msg.message);
	if (msg.verbose !== undefined)
	{
		traceOutput.appendLine("details: " + msg.verbose);
	}
}

export function activate(context: vscode.ExtensionContext) {
	if (path === undefined)
	{
		vscode.window.showErrorMessage("FModSilo: Server executable path is not set. Set the setting value and reload the window.");
		return;
	}

	fserver = child_process.spawn(path, {stdio: ["pipe", "pipe", "pipe"]});
	fserver.stdout?.setEncoding("utf-8");
	fserver.stdin?.setDefaultEncoding("utf-8");

	fserver.stderr?.setEncoding('utf-8');
	fserver.stderr?.on('data', (data) => {
		console.log("stderr: " + data);
	});

	fserver.stdout?.on('data', onMessageReceived);

	diagnosticCollectionLua = vscode.languages.createDiagnosticCollection('lua');
	traceOutput = vscode.window.createOutputChannel("FModSilo (Trace)");

	// Response listeners
	responseListeners.set("initialize", onInitializeResponse);
	responseListeners.set("shutdown", onShutdownResponse);

	// Notification Listeners
	notificationListeners.set("textDocument/publishDiagnostics", onPublishDiagnosticsNotification);
	notificationListeners.set("$/logTrace", onLogTraceNotification);

	// Initialize server
	let initializeParams: lsp.InitializeParams = <lsp.InitializeParams>{};
	initializeParams.processId = process.pid;
	initializeParams.clientInfo = {
		name: "FModSilo-VSCode",
		version: "0.2"
	};
	initializeParams.workspaceFolders = [];
	if (vscode.workspace.workspaceFolders)
	{
		for (let i = 0; i < vscode.workspace.workspaceFolders.length; i++) {
			const element = vscode.workspace.workspaceFolders[i];
			initializeParams.workspaceFolders[i] = <lsp.WorkspaceFolder>{};
			initializeParams.workspaceFolders[i].name = element.name;
			initializeParams.workspaceFolders[i].uri = element.uri.toString();
		}
	}
	else
	{
		initializeParams.rootUri = null;
	}

	initializeParams.trace = 'verbose';
	initializeParams.capabilities = <lsp.ClientCapabilities>{
		workspace: {
			workspaceFolders: true
		},
		textDocument: <lsp.TextDocumentClientCapabilities>{
			publishDiagnostics: <lsp.PublishDiagnosticsClientCapabilities>{
				relatedInformation: false
			}
		}
	};

	sendRequest("initialize", initializeParams);
}

// this method is called when your extension is deactivated
export function deactivate() {
	sendRequest("shutdown", undefined);
}