
/* tslint:disable */
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {GoogleGenAI, Modality, Content} from '@google/genai';

// --- App Constants ---
const GEMINI_API_KEY = process.env.API_KEY;
const MAX_FREE_DOWNLOADS = 5;
const MAX_SHARE_CREDITS = 5;
const TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes
const ALL_PROMPTS = [
    'A hyperrealistic portrait of a cyborg cat with glowing neon eyes.',
    'An enchanting forest filled with bioluminescent mushrooms and mythical creatures.',
    'A bustling cyberpunk city street at night, drenched in rain and neon lights.',
    'A majestic dragon soaring through a stormy sky, clutching a crystal.',
    'A retro-futuristic car driving towards a setting sun on an endless grid.',
    'An oil painting of a tranquil Japanese garden with a koi pond.',
    'A breathtaking nebula in deep space, with swirling galaxies and stars.',
    'A steam-powered airship navigating through a canyon of floating islands.',
    'A cozy, cluttered wizard\'s workshop filled with glowing potions and ancient books.',
    'An epic battle between a giant robot and a colossal sea monster in a coastal city.',
    'A hidden village of treehouses connected by rope bridges in a massive jungle.',
    'A minimalist scene of a single red umbrella in a black and white rainy cityscape.',
    'An Art Deco style grand hall, bustling with elegantly dressed figures from the 1920s.',
    'A surreal landscape where the ground is a chessboard and the sky is made of liquid gold.',
    'A close-up shot of a hummingbird with iridescent feathers, hovering by a vibrant flower.',
    'A medieval knight in ornate armor, holding a glowing sword, standing at a castle gate.',
    'A family of friendly robots having a picnic in a lush green park.',
    'An underwater city built inside a giant, transparent dome, with marine life swimming by.',
    'A lone astronaut discovering an ancient alien artifact on a desolate red planet.',
    'A high-speed chase sequence with futuristic motorcycles on a highway in the clouds.',
];
const DAILY_PROMPTS_COUNT = 5;
const CREATIONS_PER_PAGE = 12;

// --- Type Definitions ---
interface Conversation {
    id: string;
    title: string;
    history: Content[];
}


// --- App State ---
let currentUser: string | null = null;
let currentUserName: string | null = null;
let emailToReset: string | null = null;
let userState = {
  isPremium: false,
  downloadsToday: 0,
  lastDownloadDate: '',
  sharesToday: 0,
  lastShareDate: '',
  subscription: {
    plan: '', // 'monthly' or 'yearly'
    nextBilling: '',
  }
};
let userSettings = {
    imageAspectRatio: '1:1',
    imageFormat: 'image/jpeg',
    notifications: {
        featureUpdates: true,
        exportAlerts: true,
        communityNews: true,
    },
    theme: 'light',
    language: 'en-US',
    timezone: 'Africa/Johannesburg',
    domain: {
        name: 'se-mo.online',
        status: 'disconnected', // disconnected, pending, connected
    }
};
let currentCreation = {
    data: '',
    type: '', // 'image'
};
let selectedPremiumPlan: 'monthly' | 'yearly' | null = null;
let base64data = '';
let mimeType = '';
let currentPromptText = '';
let creationsCurrentPage = 1;
let conversations: Conversation[] = [];
let activeConversationId: string | null = null;
let currentFilter: string = 'none';
let isChatLoading = false;
let pinAction: 'payment' | 'settings' | null = null;


// --- DOM Elements ---
let mainContent: HTMLElement;
let splashScreen: HTMLElement;

// Auth Elements
let authContainer: HTMLDivElement;
let loginForm: HTMLFormElement;
let registerForm: HTMLFormElement;
let forgotPasswordForm: HTMLFormElement;
let resetPasswordForm: HTMLFormElement;
let authToggleLink: HTMLAnchorElement;
let forgotPasswordLink: HTMLAnchorElement;
let authTitle: HTMLHeadingElement;
let authSubtitle: HTMLParagraphElement;
let authToggleText: HTMLSpanElement;
let authErrorEl: HTMLDivElement;
let authSuccessEl: HTMLDivElement;
let authLegalContainer: HTMLDivElement;
let authLegalTabs: NodeListOf<HTMLButtonElement>;
let authLegalPanes: NodeListOf<HTMLDivElement>;

// Main UI Elements
let userStatusEl: HTMLSpanElement;
let subscribeButton: HTMLButtonElement;
let resultsContainer: HTMLDivElement;
let downloadButton: HTMLButtonElement;
let saveCreationButton: HTMLButtonElement;
let shareButton: HTMLButtonElement;
let viewCreationButton: HTMLButtonElement;
let imageSettings: HTMLDivElement;
let imageAspectRatioSelect: HTMLSelectElement;
let imageFormatSelect: HTMLSelectElement;
let resultImage: HTMLImageElement;
let promptEl: HTMLTextAreaElement;
let generateButton: HTMLButtonElement;
let aiAssistButton: HTMLButtonElement;
let statusEl: HTMLDivElement;
let spinnerContainer: HTMLDivElement;
let examplePromptsSelect: HTMLSelectElement;
let upload: HTMLInputElement;
let fileNameDisplay: HTMLSpanElement;
let fileInputLabel: HTMLLabelElement;
let imageFiltersContainer: HTMLDivElement;
let filterOptionsContainer: HTMLDivElement;

// Main Navigation
let imageNavButton: HTMLButtonElement;
let chatNavButton: HTMLButtonElement;
let imageGeneratorView: HTMLDivElement;
let chatView: HTMLDivElement;

// Chat Elements
let chatSidebar: HTMLDivElement;
let newChatButton: HTMLButtonElement;
let chatList: HTMLUListElement;
let chatMain: HTMLDivElement;
let chatMainHeader: HTMLDivElement;
let chatTitleEl: HTMLHeadingElement;
let shareChatButton: HTMLButtonElement;
let chatHistoryEl: HTMLDivElement;
let chatForm: HTMLFormElement;
let chatInput: HTMLTextAreaElement;
let chatSendButton: HTMLButtonElement;

// Preview Elements
let previewContainer: HTMLDivElement;
let imagePreview: HTMLImageElement;
let clearPreviewButton: HTMLButtonElement;


// Profile & Modals
let profileContainer: HTMLDivElement;
let profileButton: HTMLButtonElement;
let dashboardProfilePicture: HTMLImageElement;
let profileDropdown: HTMLDivElement;
let userNameDisplay: HTMLDivElement;
let userEmailDisplay: HTMLDivElement;
let logoutButton: HTMLAnchorElement;
let settingsButton: HTMLAnchorElement;
let myCreationsButton: HTMLAnchorElement;
let errorModal: HTMLDivElement;
let errorMessageContainer: HTMLDivElement;
let modalCloseButton: HTMLButtonElement;
let subscriptionModal: HTMLDivElement;
let subscriptionModalCloseButton: HTMLButtonElement;
let settingsModal: HTMLDivElement;
let settingsModalCloseButton: HTMLButtonElement;
let creationsModal: HTMLDivElement;
let creationsModalCloseButton: HTMLButtonElement;
let creationsGallery: HTMLDivElement;
let creationsPaginationControls: HTMLDivElement;
let creationsPrevPageButton: HTMLButtonElement;
let creationsNextPageButton: HTMLButtonElement;
let creationsPageInfo: HTMLSpanElement;
let shareFallbackModal: HTMLDivElement;
let shareFallbackCloseButton: HTMLButtonElement;
let gcpGuideModal: HTMLDivElement;
let showGcpGuideLink: HTMLAnchorElement;
let gcpGuideCloseButton: HTMLButtonElement;
let namecheapGuideModal: HTMLDivElement;
let showNamecheapGuideLink: HTMLAnchorElement;
let namecheapGuideCloseButton: HTMLButtonElement;


// Creations Gallery Selection
let creationsSelectionToolbar: HTMLDivElement;
let selectionCountEl: HTMLSpanElement;
let editSelectedButton: HTMLButtonElement;
let deleteSelectedButton: HTMLButtonElement;

// Daily Prompts Section
let dailyPromptsContainer: HTMLDivElement;
let dailyPromptsGallery: HTMLDivElement;
let refreshPromptsButton: HTMLButtonElement;

// Settings Modal Elements
let settingsNavLinks: NodeListOf<HTMLButtonElement>;
let settingsPanes: NodeListOf<HTMLDivElement>;
let profileForm: HTMLFormElement;
let passwordForm: HTMLFormElement;
let linksForm: HTMLFormElement;
let generationSettingsForm: HTMLFormElement;
let notificationsForm: HTMLFormElement;
let appearanceForm: HTMLFormElement;
let languageRegionForm: HTMLFormElement;
let creatorProgramForm: HTMLFormElement;
let profilePicturePreview: HTMLImageElement;
let profilePictureInput: HTMLInputElement;
let profileNameInput: HTMLInputElement;
let profileBioInput: HTMLTextAreaElement;
let currentPasswordInput: HTMLInputElement;
let newPasswordInput: HTMLInputElement;
let confirmPasswordInput: HTMLInputElement;
let facebookLinkInput: HTMLInputElement;
let xLinkInput: HTMLInputElement;
let instagramLinkInput: HTMLInputElement;
let settingImageAspectRatioSelect: HTMLSelectElement;
let settingImageFormatSelect: HTMLSelectElement;
let settingNotificationsFeatures: HTMLInputElement;
let settingNotificationsExports: HTMLInputElement;
let settingNotificationsCommunity: HTMLInputElement;
let settingDarkModeToggle: HTMLInputElement;
let settingLanguageSelect: HTMLSelectElement;
let settingTimezoneSelect: HTMLSelectElement;
let creatorAppliedMessage: HTMLDivElement;
let creatorNameInput: HTMLInputElement;
let creatorLinkInput: HTMLInputElement;
let creatorReasonInput: HTMLTextAreaElement;

// Domain Settings Elements
let domainForm: HTMLFormElement;
let domainNameInput: HTMLInputElement;
let domainStatusContainer: HTMLDivElement;
let dnsInstructions: HTMLDivElement;

// Privacy & Security Elements
let manageProjectsButton: HTMLButtonElement;
let clearCacheButton: HTMLButtonElement;
let deleteAccountButton: HTMLButtonElement;
let deleteAccountModal: HTMLDivElement;
let deleteConfirmInput: HTMLInputElement;
let cancelDeleteButton: HTMLButtonElement;
let confirmDeleteButton: HTMLButtonElement;
let managePinButton: HTMLButtonElement;

// Large View Modal Elements
let largeViewModal: HTMLDivElement;
let largeViewImage: HTMLImageElement;
let largeViewVideo: HTMLVideoElement;
let largeViewCloseButton: HTMLButtonElement;

// Payment Modal Elements
let pricingPlans: NodeListOf<HTMLDivElement>;
let continuePaymentButton: HTMLButtonElement;
let paymentMessageContainer: HTMLDivElement;
let planSelectionView: HTMLDivElement;
let paymentSelectionView: HTMLDivElement;
let selectedPlanInfo: HTMLParagraphElement;
let backToPlansButton: HTMLButtonElement;
let paypalPaymentButton: HTMLButtonElement;
let cardPaymentOverlay: HTMLDivElement;


// Subscription & Payment Settings
let subscriptionStatusContainer: HTMLDivElement;
let paymentMethodsView: HTMLDivElement;
let savedCardsList: HTMLDivElement;
let addNewCardButton: HTMLButtonElement;
let addCardForm: HTMLFormElement;
let cancelAddCardButton: HTMLButtonElement;
let cardNumberInput: HTMLInputElement;
let cardHolderInput: HTMLInputElement;
let cardExpiryInput: HTMLInputElement;
let cardCvvInput: HTMLInputElement;
let setCardDefaultCheckbox: HTMLInputElement;

// Parental PIN Modal Elements
let parentalPinModal: HTMLDivElement;
let pinModalCloseButton: HTMLButtonElement;
let pinModalTitle: HTMLHeadingElement;
let pinModalSubtitle: HTMLParagraphElement;
let pinModalViewContainer: HTMLDivElement;
let pinEnterView: HTMLDivElement;
let pinSetView: HTMLDivElement;
let pinInputContainer: HTMLDivElement;
let pinSetInputContainer: HTMLDivElement;
let pinConfirmInputContainer: HTMLDivElement;
let pinInputs: NodeListOf<HTMLInputElement>;
let setPinButton: HTMLButtonElement;
let forgotPinLink: HTMLAnchorElement;
let pinMessage: HTMLDivElement;


// --- Function Definitions ---

function cacheDOMElements() {
    mainContent = document.querySelector('main') as HTMLElement;
    splashScreen = document.getElementById('splash-screen') as HTMLElement;

    // Auth
    authContainer = document.querySelector('#auth-container') as HTMLDivElement;
    loginForm = document.querySelector('#login-form') as HTMLFormElement;
    registerForm = document.querySelector('#register-form') as HTMLFormElement;
    forgotPasswordForm = document.querySelector('#forgot-password-form') as HTMLFormElement;
    resetPasswordForm = document.querySelector('#reset-password-form') as HTMLFormElement;
    authToggleLink = document.querySelector('#auth-toggle-link') as HTMLAnchorElement;
    forgotPasswordLink = document.querySelector('#forgot-password-link') as HTMLAnchorElement;
    authTitle = document.querySelector('#auth-title') as HTMLHeadingElement;
    authSubtitle = document.querySelector('#auth-subtitle') as HTMLParagraphElement;
    authToggleText = document.querySelector('#auth-toggle-text') as HTMLSpanElement;
    authErrorEl = document.querySelector('#auth-error') as HTMLDivElement;
    authSuccessEl = document.querySelector('#auth-success') as HTMLDivElement;
    authLegalContainer = document.querySelector('#auth-legal-container') as HTMLDivElement;
    authLegalTabs = document.querySelectorAll<HTMLButtonElement>('.auth-legal-tab');
    authLegalPanes = document.querySelectorAll<HTMLDivElement>('.auth-legal-pane');


    // Main UI
    userStatusEl = document.querySelector('#user-status') as HTMLSpanElement;
    subscribeButton = document.querySelector('#subscribe-button') as HTMLButtonElement;
    resultsContainer = document.querySelector('#results-container') as HTMLDivElement;
    downloadButton = document.querySelector('#download-button') as HTMLButtonElement;
    saveCreationButton = document.querySelector('#save-creation-button') as HTMLButtonElement;
    shareButton = document.querySelector('#share-button') as HTMLButtonElement;
    viewCreationButton = document.querySelector('#view-creation-button') as HTMLButtonElement;
    imageSettings = document.querySelector('#image-settings') as HTMLDivElement;
    imageFiltersContainer = document.querySelector('#image-filters-container') as HTMLDivElement;
    filterOptionsContainer = document.querySelector('#filter-options') as HTMLDivElement;
    imageAspectRatioSelect = document.querySelector('#image-aspect-ratio-select') as HTMLSelectElement;
    imageFormatSelect = document.querySelector('#image-format-select') as HTMLSelectElement;
    resultImage = document.querySelector('#result-image') as HTMLImageElement;
    promptEl = document.querySelector('#prompt-input') as HTMLTextAreaElement;
    generateButton = document.querySelector('#generate-button') as HTMLButtonElement;
    aiAssistButton = document.querySelector('#ai-assist-button') as HTMLButtonElement;
    statusEl = document.querySelector('#status') as HTMLDivElement;
    spinnerContainer = document.querySelector('#spinner-container') as HTMLDivElement;
    examplePromptsSelect = document.querySelector('#example-prompts-select') as HTMLSelectElement;
    upload = document.querySelector('#file-input') as HTMLInputElement;
    fileNameDisplay = document.querySelector('#file-name-display') as HTMLSpanElement;
    fileInputLabel = document.querySelector('#file-input-label') as HTMLLabelElement;

    // Main Navigation
    imageNavButton = document.querySelector('#image-nav-button') as HTMLButtonElement;
    chatNavButton = document.querySelector('#chat-nav-button') as HTMLButtonElement;
    imageGeneratorView = document.querySelector('#image-generator-view') as HTMLDivElement;
    chatView = document.querySelector('#chat-view') as HTMLDivElement;

    // Chat Elements
    chatSidebar = document.querySelector('#chat-sidebar') as HTMLDivElement;
    newChatButton = document.querySelector('#new-chat-button') as HTMLButtonElement;
    chatList = document.querySelector('#chat-list') as HTMLUListElement;
    chatMain = document.querySelector('#chat-main') as HTMLDivElement;
    chatMainHeader = document.querySelector('#chat-main-header') as HTMLDivElement;
    chatTitleEl = document.querySelector('#chat-title') as HTMLHeadingElement;
    shareChatButton = document.querySelector('#share-chat-button') as HTMLButtonElement;
    chatHistoryEl = document.querySelector('#chat-history') as HTMLDivElement;
    chatForm = document.querySelector('#chat-form') as HTMLFormElement;
    chatInput = document.querySelector('#chat-input') as HTMLTextAreaElement;
    chatSendButton = document.querySelector('#chat-send-button') as HTMLButtonElement;

    // Preview
    previewContainer = document.querySelector('#preview-container') as HTMLDivElement;
    imagePreview = document.querySelector('#image-preview') as HTMLImageElement;
    clearPreviewButton = document.querySelector('#clear-preview-button') as HTMLButtonElement;


    // Profile & Modals
    profileContainer = document.querySelector('#profile-container') as HTMLDivElement;
    profileButton = document.querySelector('#profile-button') as HTMLButtonElement;
    dashboardProfilePicture = document.querySelector('#dashboard-profile-picture') as HTMLImageElement;
    profileDropdown = document.querySelector('#profile-dropdown') as HTMLDivElement;
    userNameDisplay = document.querySelector('#user-name-display') as HTMLDivElement;
    userEmailDisplay = document.querySelector('#user-email-display') as HTMLDivElement;
    logoutButton = document.querySelector('#logout-button') as HTMLAnchorElement;
    settingsButton = document.querySelector('#settings-button') as HTMLAnchorElement;
    myCreationsButton = document.querySelector('#my-creations-button') as HTMLAnchorElement;
    errorModal = document.querySelector('#error-modal') as HTMLDivElement;
    errorMessageContainer = document.querySelector('#error-message-container') as HTMLDivElement;
    modalCloseButton = document.querySelector('#modal-close-button') as HTMLButtonElement;
    subscriptionModal = document.querySelector('#subscription-modal') as HTMLDivElement;
    subscriptionModalCloseButton = document.querySelector('#subscription-modal-close-button') as HTMLButtonElement;
    settingsModal = document.querySelector('#settings-modal') as HTMLDivElement;
    settingsModalCloseButton = document.querySelector('#settings-modal-close-button') as HTMLButtonElement;
    creationsModal = document.querySelector('#creations-modal') as HTMLDivElement;
    creationsModalCloseButton = document.querySelector('#creations-modal-close-button') as HTMLButtonElement;
    creationsGallery = document.querySelector('#creations-gallery') as HTMLDivElement;
    creationsPaginationControls = document.querySelector('#creations-pagination-controls') as HTMLDivElement;
    creationsPrevPageButton = document.querySelector('#creations-prev-page') as HTMLButtonElement;
    creationsNextPageButton = document.querySelector('#creations-next-page') as HTMLButtonElement;
    creationsPageInfo = document.querySelector('#creations-page-info') as HTMLSpanElement;
    shareFallbackModal = document.querySelector('#share-fallback-modal') as HTMLDivElement;
    shareFallbackCloseButton = document.querySelector('#share-fallback-close-button') as HTMLButtonElement;
    creationsSelectionToolbar = document.querySelector('#creations-selection-toolbar') as HTMLDivElement;
    selectionCountEl = document.querySelector('#selection-count') as HTMLSpanElement;
    editSelectedButton = document.querySelector('#edit-selected-button') as HTMLButtonElement;
    deleteSelectedButton = document.querySelector('#delete-selected-button') as HTMLButtonElement;
    gcpGuideModal = document.getElementById('gcp-guide-modal') as HTMLDivElement;
    showGcpGuideLink = document.getElementById('show-gcp-guide') as HTMLAnchorElement;
    gcpGuideCloseButton = document.getElementById('gcp-guide-close-button') as HTMLButtonElement;
    namecheapGuideModal = document.getElementById('namecheap-guide-modal') as HTMLDivElement;
    showNamecheapGuideLink = document.getElementById('show-namecheap-guide') as HTMLAnchorElement;
    namecheapGuideCloseButton = document.getElementById('namecheap-guide-close-button') as HTMLButtonElement;

    // Daily Prompts Section
    dailyPromptsContainer = document.querySelector('#daily-prompts-container') as HTMLDivElement;
    dailyPromptsGallery = document.querySelector('#daily-prompts-gallery') as HTMLDivElement;
    refreshPromptsButton = document.querySelector('#refresh-prompts-button') as HTMLButtonElement;

    // Settings Modal
    settingsNavLinks = document.querySelectorAll<HTMLButtonElement>('.settings-nav-link');
    settingsPanes = document.querySelectorAll<HTMLDivElement>('.settings-pane');
    profileForm = document.querySelector('#profile-form') as HTMLFormElement;
    passwordForm = document.querySelector('#password-form') as HTMLFormElement;
    linksForm = document.querySelector('#links-form') as HTMLFormElement;
    generationSettingsForm = document.querySelector('#generation-settings-form') as HTMLFormElement;
    notificationsForm = document.querySelector('#notifications-form') as HTMLFormElement;
    appearanceForm = document.querySelector('#appearance-form') as HTMLFormElement;
    languageRegionForm = document.querySelector('#language-region-form') as HTMLFormElement;
    creatorProgramForm = document.querySelector('#creator-program-form') as HTMLFormElement;
    profilePicturePreview = document.querySelector('#profile-picture-preview') as HTMLImageElement;
    profilePictureInput = document.querySelector('#profile-picture-input') as HTMLInputElement;
    profileNameInput = document.querySelector('#profile-name-input') as HTMLInputElement;
    profileBioInput = document.querySelector('#profile-bio-input') as HTMLTextAreaElement;
    currentPasswordInput = document.querySelector('#current-password-input') as HTMLInputElement;
    newPasswordInput = document.querySelector('#new-password-input') as HTMLInputElement;
    confirmPasswordInput = document.querySelector('#confirm-password-input') as HTMLInputElement;
    facebookLinkInput = document.querySelector('#facebook-link-input') as HTMLInputElement;
    xLinkInput = document.querySelector('#x-link-input') as HTMLInputElement;
    instagramLinkInput = document.querySelector('#instagram-link-input') as HTMLInputElement;
    settingImageAspectRatioSelect = document.querySelector('#setting-image-aspect-ratio') as HTMLSelectElement;
    settingImageFormatSelect = document.querySelector('#setting-image-format') as HTMLSelectElement;
    settingNotificationsFeatures = document.querySelector('#setting-notifications-features') as HTMLInputElement;
    settingNotificationsExports = document.querySelector('#setting-notifications-exports') as HTMLInputElement;
    settingNotificationsCommunity = document.querySelector('#setting-notifications-community') as HTMLInputElement;
    settingDarkModeToggle = document.querySelector('#setting-dark-mode-toggle') as HTMLInputElement;
    settingLanguageSelect = document.querySelector('#setting-language-select') as HTMLSelectElement;
    settingTimezoneSelect = document.querySelector('#setting-timezone-select') as HTMLSelectElement;
    creatorAppliedMessage = document.querySelector('#creator-applied-message') as HTMLDivElement;
    creatorNameInput = document.querySelector('#creator-name-input') as HTMLInputElement;
    creatorLinkInput = document.querySelector('#creator-link-input') as HTMLInputElement;
    creatorReasonInput = document.querySelector('#creator-reason-input') as HTMLTextAreaElement;

    // Domain Settings
    domainForm = document.querySelector('#domain-form') as HTMLFormElement;
    domainNameInput = document.querySelector('#domain-name-input') as HTMLInputElement;
    domainStatusContainer = document.querySelector('#domain-status-container') as HTMLDivElement;
    dnsInstructions = document.querySelector('#dns-instructions') as HTMLDivElement;


    // Privacy & Security
    manageProjectsButton = document.querySelector('#manage-projects-button') as HTMLButtonElement;
    clearCacheButton = document.querySelector('#clear-cache-button') as HTMLButtonElement;
    deleteAccountButton = document.querySelector('#delete-account-button') as HTMLButtonElement;
    deleteAccountModal = document.querySelector('#delete-account-modal') as HTMLDivElement;
    deleteConfirmInput = document.querySelector('#delete-confirm-input') as HTMLInputElement;
    cancelDeleteButton = document.querySelector('#cancel-delete-button') as HTMLButtonElement;
    confirmDeleteButton = document.querySelector('#confirm-delete-button') as HTMLButtonElement;
    managePinButton = document.getElementById('manage-pin-button') as HTMLButtonElement;

    // Large View Modal
    largeViewModal = document.querySelector('#large-view-modal') as HTMLDivElement;
    largeViewImage = document.querySelector('#large-view-image') as HTMLImageElement;
    largeViewVideo = document.querySelector('#large-view-video') as HTMLVideoElement;
    largeViewCloseButton = document.querySelector('#large-view-close-button') as HTMLButtonElement;
    
    // Payment
    pricingPlans = document.querySelectorAll<HTMLDivElement>('.pricing-plan');
    continuePaymentButton = document.querySelector('#continue-payment-button') as HTMLButtonElement;
    paymentMessageContainer = document.querySelector('#payment-message-container') as HTMLDivElement;
    planSelectionView = document.querySelector('#plan-selection-view') as HTMLDivElement;
    paymentSelectionView = document.querySelector('#payment-selection-view') as HTMLDivElement;
    selectedPlanInfo = document.querySelector('#selected-plan-info') as HTMLParagraphElement;
    backToPlansButton = document.querySelector('#back-to-plans-button') as HTMLButtonElement;
    paypalPaymentButton = document.getElementById('paypal-payment-button') as HTMLButtonElement;
    cardPaymentOverlay = document.getElementById('card-payment-overlay') as HTMLDivElement;

    // Subscription & Payment Settings
    subscriptionStatusContainer = document.querySelector('#subscription-status-container') as HTMLDivElement;
    paymentMethodsView = document.querySelector('#payment-methods-view') as HTMLDivElement;
    savedCardsList = document.querySelector('#saved-cards-list') as HTMLDivElement;
    addNewCardButton = document.querySelector('#add-new-card-button') as HTMLButtonElement;
    addCardForm = document.querySelector('#add-card-form') as HTMLFormElement;
    cancelAddCardButton = document.querySelector('#cancel-add-card-button') as HTMLButtonElement;
    cardNumberInput = document.querySelector('#card-number-input') as HTMLInputElement;
    cardHolderInput = document.querySelector('#card-holder-input') as HTMLInputElement;
    cardExpiryInput = document.querySelector('#card-expiry-input') as HTMLInputElement;
    cardCvvInput = document.querySelector('#card-cvv-input') as HTMLInputElement;
    setCardDefaultCheckbox = document.querySelector('#set-card-default-checkbox') as HTMLInputElement;
    
    // Parental PIN Modal
    parentalPinModal = document.getElementById('parental-pin-modal') as HTMLDivElement;
    pinModalCloseButton = document.getElementById('pin-modal-close-button') as HTMLButtonElement;
    pinModalTitle = document.getElementById('pin-modal-title') as HTMLHeadingElement;
    pinModalSubtitle = document.getElementById('pin-modal-subtitle') as HTMLParagraphElement;
    pinModalViewContainer = document.getElementById('pin-modal-view-container') as HTMLDivElement;
    pinEnterView = document.getElementById('pin-enter-view') as HTMLDivElement;
    pinSetView = document.getElementById('pin-set-view') as HTMLDivElement;
    pinInputContainer = document.getElementById('pin-input-container') as HTMLDivElement;
    pinSetInputContainer = document.getElementById('pin-set-input-container') as HTMLDivElement;
    pinConfirmInputContainer = document.getElementById('pin-confirm-input-container') as HTMLDivElement;
    pinInputs = parentalPinModal.querySelectorAll('.pin-input');
    setPinButton = document.getElementById('set-pin-button') as HTMLButtonElement;
    forgotPinLink = document.getElementById('forgot-pin-link') as HTMLAnchorElement;
    pinMessage = document.getElementById('pin-message') as HTMLDivElement;
}

function showErrorModal(messages: string[], title: string = 'An Error Occurred') {
    if (!errorModal || !errorMessageContainer) return;
    
    const errorTitleEl = errorModal.querySelector('h3');
    if (errorTitleEl) {
        errorTitleEl.textContent = title;
    }

    errorMessageContainer.innerHTML = ''; // Clear previous messages
    messages.forEach(msg => {
        const p = document.createElement('p');
        p.textContent = msg;
        errorMessageContainer.appendChild(p);
    });
    
    errorModal.style.display = 'flex';
}

function showSettingsToast(message: string, type: 'success' | 'error' = 'success') {
    const toast = document.createElement('div');
    toast.className = `settings-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('visible');
    }, 10);

    // Animate out and remove
    setTimeout(() => {
        toast.classList.remove('visible');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

function setControlsDisabled(disabled: boolean) {
    if (generateButton) generateButton.disabled = disabled;
    if (aiAssistButton) aiAssistButton.disabled = disabled;
    if (promptEl) promptEl.disabled = disabled;
    if (upload) upload.disabled = disabled;
    if (imageAspectRatioSelect) imageAspectRatioSelect.disabled = disabled;
    if (imageFormatSelect) imageFormatSelect.disabled = disabled;
}

function populateDailyPrompts() {
    if (!dailyPromptsGallery) return;
    dailyPromptsGallery.innerHTML = '';
    
    // Get a random subset of prompts
    const shuffled = [...ALL_PROMPTS].sort(() => 0.5 - Math.random());
    const promptsToShow = shuffled.slice(0, DAILY_PROMPTS_COUNT);
    
    promptsToShow.forEach(promptText => {
        const promptCard = document.createElement('button');
        promptCard.className = 'prompt-card';
        promptCard.textContent = promptText;
        promptCard.addEventListener('click', () => {
            if (promptEl) {
                promptEl.value = promptText;
                promptEl.dispatchEvent(new Event('input', { bubbles: true }));
                promptEl.focus();
            }
        });
        dailyPromptsGallery.appendChild(promptCard);
    });
}

function renderSubscriptionStatus() {
    if (!subscriptionStatusContainer) return;
    if (userState.isPremium) {
        subscriptionStatusContainer.innerHTML = `
            <p><strong>Current Plan:</strong> Premium (${userState.subscription.plan})</p>
            <p><strong>Next Billing Date:</strong> ${userState.subscription.nextBilling}</p>
            <button class="button button-danger">Cancel Subscription</button>
        `;
        // Add event listener for cancellation if needed
    } else {
        subscriptionStatusContainer.innerHTML = `
            <p>You are on the <strong>Free Plan</strong>.</p>
            <p>Upgrade to Premium for unlimited downloads and higher quality exports.</p>
            <button class="button button-primary" id="settings-upgrade-button">Upgrade to Premium</button>
        `;
        const upgradeButton = document.getElementById('settings-upgrade-button');
        if (upgradeButton) {
            upgradeButton.addEventListener('click', () => {
                if (settingsModal) settingsModal.style.display = 'none';
                if (subscriptionModal) subscriptionModal.style.display = 'flex';
            });
        }
    }
}

function renderSavedCards() {
    if (!savedCardsList || !currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const cards = users[currentUser]?.paymentMethods || [];
    
    savedCardsList.innerHTML = '';
    
    if (cards.length === 0) {
        savedCardsList.innerHTML = '<p>No payment methods saved.</p>';
        return;
    }
    
    cards.forEach((card: any) => {
        let logoUrl = '';
        const cardTypeLower = card.type.toLowerCase();
        if (cardTypeLower === 'visa') {
            logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg';
        } else if (cardTypeLower === 'mastercard') {
            logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg';
        }
        
        const cardEl = document.createElement('div');
        cardEl.className = 'saved-card-item';
        cardEl.innerHTML = `
            <img src="${logoUrl}" class="card-icon" alt="${card.type}">
            <div class="card-info">
                <span>${card.type} ending in ${card.maskedNumber}</span>
                <small>Holder: ${card.holderName}</small>
            </div>
            <div class="card-actions">
                ${!card.isDefault ? '<button class="button-text set-default-btn" data-id="'+card.id+'">Set as default</button>' : '<span class="default-badge">Default</span>'}
                <button class="button-text-danger remove-card-btn" data-id="${card.id}">Remove</button>
            </div>
        `;
        savedCardsList.appendChild(cardEl);
    });
}

function renderDomainStatus() {
    if (!domainNameInput || !domainStatusContainer || !dnsInstructions) return;

    domainNameInput.value = userSettings.domain.name;
    domainStatusContainer.className = `domain-status-container status-${userSettings.domain.status}`;
    
    const domainDisplays = document.querySelectorAll('.user-domain-dynamic');
    domainDisplays.forEach(el => el.textContent = userSettings.domain.name || 'yourdomain.com');

    let statusHtml = '';
    switch(userSettings.domain.status) {
        case 'connected':
            statusHtml = `<h4><span class="status-badge">✔</span> Connected</h4><p>Your domain is successfully pointing to your creations.</p>`;
            dnsInstructions.style.display = 'none';
            break;
        case 'pending':
            statusHtml = `<h4><span class="status-badge">...</span> Pending Verification</h4><p>Waiting for DNS records to propagate.</p>`;
            dnsInstructions.style.display = 'block';
            break;
        case 'disconnected':
        default:
            statusHtml = `<h4><span class="status-badge">✖</span> Disconnected</h4><p>Enter your domain name to begin setup.</p>`;
            dnsInstructions.style.display = 'none';
            break;
    }
    domainStatusContainer.innerHTML = statusHtml;
}

function toggleAddCardView(showForm: boolean) {
    if (addCardForm && addNewCardButton) {
        addCardForm.style.display = showForm ? 'block' : 'none';
        addNewCardButton.style.display = showForm ? 'none' : 'block';
        if (showForm) {
            (addCardForm as HTMLFormElement).reset();
        }
    }
}

// --- Chat ---
function showEmptyChatView() {
    if (!chatMain || !chatMainHeader || !chatHistoryEl || !chatForm) return;

    chatMainHeader.style.visibility = 'hidden';
    chatHistoryEl.innerHTML = `
        <div class="empty-chat-view">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
            <h2>Start a conversation</h2>
            <p>Click "New Chat" to begin a new conversation with the assistant.</p>
        </div>
    `;
    chatForm.style.display = 'none';
    activeConversationId = null;
    sessionStorage.removeItem('activeConversationId');
}

function renderConversationHistory() {
    if (!chatHistoryEl || !activeConversationId) return;

    const conversation = conversations.find(c => c.id === activeConversationId);
    if (!conversation) {
        chatHistoryEl.innerHTML = '';
        return;
    }

    chatHistoryEl.innerHTML = '';
    conversation.history.forEach(message => {
        const messageEl = document.createElement('div');
        messageEl.classList.add('chat-message', `message-${message.role}`);
        
        const text = message.parts.map(part => (part as { text: string }).text).join('');

        // Basic markdown to HTML conversion
        let htmlContent = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;").replace(/>/g, "&gt;") // Sanitize
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/```([\s\S]*?)```/g, (_match, code) => `<pre><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`) // Code blocks
            .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
            .replace(/\n/g, '<br>');

        messageEl.innerHTML = `
            <div class="message-avatar">${message.role === 'user' ? 'You' : 'AI'}</div>
            <div class="message-content">${htmlContent}</div>
        `;
        chatHistoryEl.appendChild(messageEl);
    });

    chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
}

function renderConversationsList() {
    if (!chatList) return;
    chatList.innerHTML = '';
    
    conversations.forEach(convo => {
        const li = document.createElement('li');
        li.dataset.id = convo.id;
        li.className = `conversation-item ${convo.id === activeConversationId ? 'active' : ''}`;
        li.innerHTML = `
            <span>${convo.title}</span>
            <button class="icon-button delete-conversation-btn" title="Delete Chat">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
            </button>
        `;
        
        li.addEventListener('click', (e) => {
            if (!(e.target as HTMLElement).closest('.delete-conversation-btn')) {
                handleConversationSelection(convo.id);
            }
        });
        
        const deleteBtn = li.querySelector('.delete-conversation-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteConversation(convo.id);
            });
        }
        
        chatList.appendChild(li);
    });
}

function handleConversationSelection(id: string) {
    const conversation = conversations.find(c => c.id === id);
    if (!conversation || !chatMainHeader || !chatTitleEl || !chatHistoryEl || !chatForm) return;

    activeConversationId = id;
    sessionStorage.setItem('activeConversationId', id);
    
    // Update UI
    chatMainHeader.style.visibility = 'visible';
    chatForm.style.display = 'flex';
    if(chatInput) chatInput.value = '';
    chatTitleEl.textContent = conversation.title;
    
    renderConversationHistory();
    renderConversationsList(); // To update active state
}

function deleteConversation(id: string) {
    if (!confirm('Are you sure you want to delete this chat?')) return;

    conversations = conversations.filter(c => c.id !== id);
    saveConversations();

    if (activeConversationId === id) {
        if (conversations.length > 0) {
            handleConversationSelection(conversations[0].id);
        } else {
            showEmptyChatView();
        }
    }
    
    renderConversationsList();
}

function loadConversations() {
    if (!currentUser) return;
    const savedConversations = localStorage.getItem(`conversations_${currentUser}`);
    if (savedConversations) {
        try {
            conversations = JSON.parse(savedConversations);
        } catch (e) {
            console.error("Failed to parse conversations:", e);
            conversations = [];
        }
    } else {
        conversations = [];
    }
    
    renderConversationsList();

    if (conversations.length > 0) {
        const lastActiveId = sessionStorage.getItem('activeConversationId');
        const conversationExists = conversations.some(c => c.id === lastActiveId);

        if (lastActiveId && conversationExists) {
            handleConversationSelection(lastActiveId);
        } else {
            handleConversationSelection(conversations[0].id);
        }
    } else {
        showEmptyChatView();
    }
}

function saveConversations() {
    if (!currentUser) return;
    localStorage.setItem(`conversations_${currentUser}`, JSON.stringify(conversations));
}

async function handleChatSubmit(e?: Event) {
    if (e) e.preventDefault();
    if (isChatLoading || !chatInput || !activeConversationId) return;

    const prompt = chatInput.value.trim();
    if (!prompt) return;

    const conversation = conversations.find(c => c.id === activeConversationId);
    if (!conversation) return;

    // Add user message to history
    conversation.history.push({
        role: 'user',
        parts: [{ text: prompt }]
    });

    if (conversation.history.length === 1 && conversation.title === 'New Chat') {
        const shortTitle = prompt.substring(0, 30) + (prompt.length > 30 ? '...' : '');
        conversation.title = shortTitle;
        if (chatTitleEl) chatTitleEl.textContent = shortTitle;
        renderConversationsList();
    }
    
    renderConversationHistory();
    chatInput.value = '';
    isChatLoading = true;
    if (chatSendButton) chatSendButton.disabled = true;
    if (chatInput) chatInput.disabled = true;

    const loadingEl = document.createElement('div');
    loadingEl.classList.add('chat-message', 'message-model', 'loading');
    loadingEl.innerHTML = `
        <div class="message-avatar">AI</div>
        <div class="message-content"><div class="typing-indicator"></div></div>
    `;
    if (chatHistoryEl) {
        chatHistoryEl.appendChild(loadingEl);
        chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
    }
    
    try {
        const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: conversation.history.slice(0, -1)
        });

        const result = await chat.sendMessage({ message: prompt });
        const responseText = result.text;
        
        conversation.history.push({
            role: 'model',
            parts: [{ text: responseText }]
        });
        saveConversations();

    } catch (error) {
        console.error('Chat generation failed:', error);
        conversation.history.push({
            role: 'model',
            parts: [{ text: 'Sorry, I encountered an error. Please try again.' }]
        });
        showErrorModal(['The chat model failed to respond. This might be due to a network issue or an API error.'], 'Chat Error');
    } finally {
        isChatLoading = false;
        if (chatSendButton) chatSendButton.disabled = false;
        if (chatInput) chatInput.disabled = false;
        if (loadingEl) loadingEl.remove();
        renderConversationHistory();
        if (chatInput) chatInput.focus();
    }
}

async function handleNewChat() {
    const newConversation: Conversation = {
        id: `convo-${Date.now()}`,
        title: 'New Chat',
        history: [],
    };
    conversations.unshift(newConversation);
    saveConversations();
    renderConversationsList();
    handleConversationSelection(newConversation.id);
    if (chatInput) chatInput.focus();
}

// --- Authentication ---
function checkAuthStatus() {
    const user = sessionStorage.getItem('currentUser');
    const name = sessionStorage.getItem('currentUserName');
    
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message === 'account_deleted' && authSuccessEl) {
        authSuccessEl.textContent = 'Your account has been successfully deleted.';
        authSuccessEl.style.display = 'block';
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (user) {
        currentUser = user;
        currentUserName = name;
        showMainApp();
    } else {
        // Before showing auth, apply any saved global theme
        const savedTheme = localStorage.getItem('global_theme') || 'light';
        document.body.dataset.theme = savedTheme;
        showAuthScreen();
    }
}

function showAuthScreen() {
    if (authContainer) authContainer.style.display = 'flex';
    if (mainContent) mainContent.style.display = 'none';
    switchAuthView('login');
}

function showMainApp() {
    if (authContainer) authContainer.style.display = 'none';
    if (mainContent) {
        mainContent.style.display = 'block';
        mainContent.classList.add('visible');
    }
    initializeUserState(); // This will load profile, settings (including theme), and user state
    loadUserProfile();
    populateDailyPrompts();
    loadConversations();
    if (dailyPromptsContainer) dailyPromptsContainer.style.display = 'block';
}

function switchAuthView(view: 'login' | 'register' | 'forgot' | 'reset') {
    // Hide all forms and legal container first
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'none';
    if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
    if (resetPasswordForm) resetPasswordForm.style.display = 'none';
    if (authLegalContainer) authLegalContainer.style.display = 'none';

    // Clear messages unless coming from a redirect
     const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('message')) {
        if (authSuccessEl) {
            authSuccessEl.textContent = '';
            authSuccessEl.style.display = 'none';
        }
    }
    if (authErrorEl) authErrorEl.textContent = '';


    switch(view) {
        case 'login':
            if (loginForm) loginForm.style.display = 'block';
            if (authTitle) authTitle.textContent = 'Login';
            if (authSubtitle) authSubtitle.textContent = 'Welcome back! Please enter your details.';
            if (authToggleText) authToggleText.textContent = "Don't have an account?";
            if (authToggleLink) {
                authToggleLink.textContent = 'Register';
                authToggleLink.dataset.mode = 'register';
            }
            if (authToggleText?.parentElement) authToggleText.parentElement.style.display = 'block';
            break;
        case 'register':
            if (registerForm) registerForm.style.display = 'block';
            if (authLegalContainer) authLegalContainer.style.display = 'block';
            if (authTitle) authTitle.textContent = 'Create Account';
            if (authSubtitle) authSubtitle.textContent = 'Get started with your free account.';
            if (authToggleText) authToggleText.textContent = 'Already have an account?';
            if (authToggleLink) {
                authToggleLink.textContent = 'Login';
                authToggleLink.dataset.mode = 'login';
            }
            if (authToggleText?.parentElement) authToggleText.parentElement.style.display = 'block';
            break;
        case 'forgot':
            if (forgotPasswordForm) forgotPasswordForm.style.display = 'block';
            if (authTitle) authTitle.textContent = 'Reset Password';
            if (authSubtitle) authSubtitle.textContent = 'Enter your email to receive a reset link.';
            if (authToggleText) authToggleText.textContent = '';
            if (authToggleLink) {
                authToggleLink.textContent = 'Back to Login';
                authToggleLink.dataset.mode = 'login';
            }
            if (authToggleText?.parentElement) authToggleText.parentElement.style.display = 'block';
            break;
        case 'reset':
            if (resetPasswordForm) resetPasswordForm.style.display = 'block';
            if (authTitle) authTitle.textContent = 'Create New Password';
            if (authSubtitle) authSubtitle.textContent = 'Your new password must be at least 6 characters.';
            if (authToggleText?.parentElement) authToggleText.parentElement.style.display = 'none'; // No easy way back from here
            break;
    }
}

function handleLogin(e: Event) {
    e.preventDefault();
    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[email] && users[email].password === password) {
        const name = users[email].name || 'User';
        sessionStorage.setItem('currentUser', email);
        sessionStorage.setItem('currentUserName', name);
        currentUser = email;
        currentUserName = name;
        showMainApp();
    } else {
        if (authErrorEl) authErrorEl.textContent = 'Invalid email or password.';
    }
}

function handleRegister(e: Event) {
    e.preventDefault();
    const name = (document.getElementById('register-name') as HTMLInputElement).value;
    const email = (document.getElementById('register-email') as HTMLInputElement).value;
    const password = (document.getElementById('register-password') as HTMLInputElement).value;
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[email]) {
        if (authErrorEl) authErrorEl.textContent = 'An account with this email already exists.';
        return;
    }
    if (password.length < 6) {
        if (authErrorEl) authErrorEl.textContent = 'Password must be at least 6 characters long.';
        return;
    }

    users[email] = {
        password,
        name,
        profile: {
            bio: '',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2EwYTBiMiIgd2lkdGg9IjgwcHgiIGhlaWdodD0iODBweCI+PHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPjwvc3ZnPg==',
            links: { facebook: '', x: '', instagram: '' }
        },
        paymentMethods: [],
        parentalPin: null,
    };
    localStorage.setItem('users', JSON.stringify(users));
    
    // Automatically log in after registration
    sessionStorage.setItem('currentUser', email);
    sessionStorage.setItem('currentUserName', name);
    currentUser = email;
    currentUserName = name;
    showMainApp();
}

function handleLogout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUserName');
    currentUser = null;
    currentUserName = null;
    conversations = [];
    activeConversationId = null;
    window.location.search = '';
    showAuthScreen();
}

async function handleForgotPasswordRequest(e: Event) {
    e.preventDefault();
    const email = (document.getElementById('forgot-email') as HTMLInputElement).value;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    // Always show a generic message to prevent email enumeration
    if (authSuccessEl) {
        authSuccessEl.textContent = 'If an account with that email exists, a password reset link has been sent.';
        authSuccessEl.style.display = 'block';
    }
    if (authErrorEl) authErrorEl.textContent = '';
    (e.target as HTMLFormElement).reset();
    
    if (users[email]) {
        const token = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const expiry = Date.now() + TOKEN_EXPIRY_MS;
        const resetData = { token, expiry };
        localStorage.setItem(`reset_${email}`, JSON.stringify(resetData));
        emailToReset = email;

        // Simulate clicking the link in the email
        setTimeout(() => {
            if (authSuccessEl) {
                authSuccessEl.textContent = '';
                authSuccessEl.style.display = 'none';
            }
            switchAuthView('reset');
        }, 2000); // Wait 2 seconds before showing the reset form
    }
}

async function handlePasswordReset(e: Event) {
    e.preventDefault();
    if (!emailToReset) {
        if (authErrorEl) authErrorEl.textContent = 'Password reset session expired. Please try again.';
        switchAuthView('forgot');
        return;
    }

    const newPassword = (document.getElementById('reset-new-password') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('reset-confirm-password') as HTMLInputElement).value;
    
    if (newPassword.length < 6) {
        if (authErrorEl) authErrorEl.textContent = 'Password must be at least 6 characters long.';
        return;
    }
    if (newPassword !== confirmPassword) {
        if (authErrorEl) authErrorEl.textContent = 'Passwords do not match.';
        return;
    }

    const resetDataStr = localStorage.getItem(`reset_${emailToReset}`);
    if (!resetDataStr) {
        if (authErrorEl) authErrorEl.textContent = 'Invalid or expired reset link. Please request a new one.';
        return;
    }

    const resetData = JSON.parse(resetDataStr);
    if (Date.now() > resetData.expiry) {
        localStorage.removeItem(`reset_${emailToReset}`);
        if (authErrorEl) authErrorEl.textContent = 'Reset link has expired. Please request a new one.';
        return;
    }
    
    // All checks passed, update password
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[emailToReset].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    // Cleanup
    localStorage.removeItem(`reset_${emailToReset}`);
    emailToReset = null;

    // Show success and switch to login
    switchAuthView('login');
    if (authSuccessEl) {
        authSuccessEl.textContent = 'Password has been reset successfully. Please log in.';
        authSuccessEl.style.display = 'block';
    }
}

function setupAuthLegalTabs() {
    authLegalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;

            // Deactivate all tabs and panes
            authLegalTabs.forEach(t => t.classList.remove('active'));
            authLegalPanes.forEach(p => p.classList.remove('active'));

            // Activate clicked tab and corresponding pane
            tab.classList.add('active');
            const correspondingPane = document.querySelector(`.auth-legal-pane[data-tab-content="${tabId}"]`);
            if (correspondingPane) {
                correspondingPane.classList.add('active');
            }
        });
    });
}

// --- User State & UI ---
function loadUserProfile() {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentUser];
    if (user) {
        currentUserName = user.name || 'User';
        if (userNameDisplay) userNameDisplay.textContent = currentUserName;
        if (userEmailDisplay) userEmailDisplay.textContent = currentUser;
        if (dashboardProfilePicture) dashboardProfilePicture.src = user.profile?.avatar || '';
    }
}

function initializeUserState() {
  if (!currentUser) return;
  const today = new Date().toISOString().split('T')[0];
  const userData = JSON.parse(localStorage.getItem(`user_${currentUser}`) || '{}');

  userState.isPremium = userData.isPremium || false;
  userState.lastDownloadDate = userData.lastDownloadDate || '';
  userState.lastShareDate = userData.lastShareDate || '';
  userState.subscription = userData.subscription || { plan: '', nextBilling: '' };

  if (userState.lastDownloadDate !== today) {
    userState.downloadsToday = 0;
    userState.lastDownloadDate = today;
  } else {
    userState.downloadsToday = userData.downloadsToday || 0;
  }
  
  if (userState.lastShareDate !== today) {
      userState.sharesToday = 0;
      userState.lastShareDate = today;
  } else {
      userState.sharesToday = userData.sharesToday || 0;
  }
  
  saveUserState();
  updateUserStatusUI();
  
  loadUserSettings();
  applyTheme();
  applyUserSettingsToDashboard();
}

function saveUserState() {
    if (!currentUser) return;
    const userData = {
        isPremium: userState.isPremium,
        downloadsToday: userState.downloadsToday,
        lastDownloadDate: userState.lastDownloadDate,
        sharesToday: userState.sharesToday,
        lastShareDate: userState.lastShareDate,
        subscription: userState.subscription,
    };
    localStorage.setItem(`user_${currentUser}`, JSON.stringify(userData));
}

function loadUserSettings() {
    if (!currentUser) return;
    const savedSettings = JSON.parse(localStorage.getItem(`settings_${currentUser}`) || '{}');
    userSettings = {
        imageAspectRatio: savedSettings.imageAspectRatio || '1:1',
        imageFormat: savedSettings.imageFormat || 'image/jpeg',
        notifications: savedSettings.notifications || {
            featureUpdates: true,
            exportAlerts: true,
            communityNews: true,
        },
        theme: savedSettings.theme || 'light',
        language: savedSettings.language || 'en-US',
        timezone: savedSettings.timezone || 'Africa/Johannesburg',
        domain: savedSettings.domain || { name: 'se-mo.online', status: 'disconnected' },
    };
}

function saveUserSettings() {
    if (!currentUser) return;
    localStorage.setItem(`settings_${currentUser}`, JSON.stringify(userSettings));
    // Also save theme globally for the login screen
    localStorage.setItem('global_theme', userSettings.theme);
}

function applyTheme() {
    document.body.dataset.theme = userSettings.theme;
}


function applyUserSettingsToDashboard() {
    if (imageAspectRatioSelect) imageAspectRatioSelect.value = userSettings.imageAspectRatio;
    if (imageFormatSelect) imageFormatSelect.value = userSettings.imageFormat;
}


function updateUserStatusUI() {
  if (userState.isPremium) {
    if (userStatusEl) {
        userStatusEl.innerHTML = `<span class="premium-badge">Premium</span> Unlimited Access`;
    }
    if (subscribeButton) subscribeButton.style.display = 'none';
  } else {
    const remainingDownloads = MAX_FREE_DOWNLOADS - userState.downloadsToday;
    const remainingShares = MAX_SHARE_CREDITS - userState.sharesToday;
    
    let statusHTML = `<div class="status-line"><span class="free-badge">Free</span> <span>Downloads: <strong>${remainingDownloads}/${MAX_FREE_DOWNLOADS}</strong></span>`;
    
    if (remainingShares > 0) {
      statusHTML += ` <span class="status-separator">|</span> <span>Shares: <strong>${remainingShares}/${MAX_SHARE_CREDITS}</strong></span>`;
    }
    statusHTML += `</div>`;

    if (remainingDownloads <= 0) {
      let cta = 'Out of downloads? ';
      if (remainingShares > 0) {
          cta += `Share to earn more or `;
      }
      cta += `<strong class="upgrade-cta">upgrade to Premium</strong> for unlimited access.`;
      statusHTML += `<small class="status-cta">${cta}</small>`;
    }
    
    if (userStatusEl) userStatusEl.innerHTML = statusHTML;
    if (subscribeButton) subscribeButton.style.display = 'block';
  }
}

// --- Payment & PIN ---
function handlePlanSelection(selectedPlanElement: HTMLDivElement) {
    pricingPlans.forEach(plan => plan.classList.remove('selected'));
    selectedPlanElement.classList.add('selected');
    selectedPremiumPlan = selectedPlanElement.dataset.plan as 'monthly' | 'yearly';
}

function showPaymentMessage(message: string, type: 'success' | 'error') {
  if (!paymentMessageContainer) return;
  paymentMessageContainer.textContent = message;
  paymentMessageContainer.className = `payment-message-${type}`;
}

function showPaymentSelectionView() {
    if (!selectedPremiumPlan) {
        showPaymentMessage('Please select a plan.', 'error');
        return;
    }
    if(paymentMessageContainer) paymentMessageContainer.innerHTML = '';
    if(planSelectionView) planSelectionView.style.display = 'none';
    if(paymentSelectionView) paymentSelectionView.style.display = 'block';
    
    const planName = selectedPremiumPlan.charAt(0).toUpperCase() + selectedPremiumPlan.slice(1);
    const planPrice = selectedPremiumPlan === 'monthly' ? '$9.99' : '$99.99';
    const planDuration = selectedPremiumPlan === 'monthly' ? '/ month' : '/ year';

    if(selectedPlanInfo) selectedPlanInfo.textContent = `Selected Plan: ${planName} (${planPrice}${planDuration})`;
}

function showPinModal(view: 'enter' | 'set') {
    if (!parentalPinModal) return;

    // Reset everything first
    pinInputs.forEach(input => { (input as HTMLInputElement).value = ''});
    if (pinMessage) {
        pinMessage.textContent = '';
        pinMessage.className = 'pin-message'; // Reset classes
    }
    
    // Hide all main views
    if(pinEnterView) pinEnterView.style.display = 'none';
    if(pinSetView) pinSetView.style.display = 'none';

    // Show the correct view and set titles
    if (view === 'enter') {
        if(pinEnterView) pinEnterView.style.display = 'block';
        if(pinModalTitle) pinModalTitle.textContent = 'Enter PIN';
        if(pinModalSubtitle) pinModalSubtitle.textContent = 'Please enter your PIN to continue.';
        if(forgotPinLink) forgotPinLink.style.display = 'block';
    } else if (view === 'set') {
        if(pinSetView) pinSetView.style.display = 'block';
        if(pinModalTitle) pinModalTitle.textContent = 'Set a PIN';
        if(pinModalSubtitle) pinModalSubtitle.textContent = 'Create a 4-digit PIN to secure actions on your account.';
        if(forgotPinLink) forgotPinLink.style.display = 'none';
        // Reset set view to first step
        if(pinSetInputContainer) pinSetInputContainer.style.display = 'block';
        if(pinConfirmInputContainer) pinConfirmInputContainer.style.display = 'none';
        if(setPinButton) {
            setPinButton.textContent = 'Next';
            setPinButton.disabled = true;
        }
    }
    
    if (pinAction === 'payment') {
        if (view === 'enter' && pinModalSubtitle) {
            pinModalSubtitle.textContent = 'Please enter your PIN to authorize this payment.';
        } else if (view === 'set' && pinModalSubtitle) {
            pinModalSubtitle.textContent = 'For added security, please set a PIN before making a payment.';
        }
    } else if (pinAction === 'settings') {
        if (view === 'enter' && pinModalSubtitle) {
            pinModalSubtitle.textContent = 'Please enter your PIN to change sensitive settings.';
        } else if (view === 'set' && pinModalSubtitle) {
            pinModalSubtitle.textContent = 'Set a PIN to protect your account settings.';
        }
    }

    parentalPinModal.style.display = 'flex';
    // Focus the first visible input
    const firstInput = parentalPinModal.querySelector<HTMLInputElement>('div[style*="display: block"] .pin-input');
    if (firstInput) {
        firstInput.focus();
    }
}

function handlePayPalPayment() {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentUser];

    pinAction = 'payment';

    if (user && user.parentalPin) {
        showPinModal('enter');
    } else {
        showPinModal('set');
    }
}

async function processSubscriptionPayment() {
  showPaymentMessage('Processing payment...', 'success');
  
  // Simulate API call
  setTimeout(() => {
    showPaymentMessage('Payment successful! Welcome to Premium.', 'success');
    
    setTimeout(() => {
      userState.isPremium = true;
      userState.subscription.plan = selectedPremiumPlan!;
      const nextBillingDate = new Date();
      if (selectedPremiumPlan === 'monthly') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }
      userState.subscription.nextBilling = nextBillingDate.toLocaleDateString();

      saveUserState();
      updateUserStatusUI();
      if (subscriptionModal) {
        subscriptionModal.style.display = 'none';
        // Reset modal state
        if(planSelectionView) planSelectionView.style.display = 'block';
        if(paymentSelectionView) paymentSelectionView.style.display = 'none';
      }
      if (paymentMessageContainer) paymentMessageContainer.innerHTML = '';
      
      // Reset plan selection
      pricingPlans.forEach(plan => plan.classList.remove('selected'));
      selectedPremiumPlan = null;

    }, 2000);
  }, 1500);
}

// --- Generation ---
function clearPreview() {
    if (previewContainer) previewContainer.style.display = 'none';
    if (imagePreview) {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
    }
    if (upload) upload.value = ''; // Reset file input
    if (fileNameDisplay) fileNameDisplay.textContent = 'No file chosen';

    base64data = '';
    mimeType = '';

    if (statusEl) statusEl.textContent = 'Ready.';
    
    // Re-evaluate generate button state
    if (generateButton) {
        generateButton.disabled = currentPromptText.trim() === '';
    }
}

async function handleFileUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) {
      clearPreview();
      return;
    }
    
    if (fileNameDisplay) fileNameDisplay.textContent = file.name;
  
    const isImage = file.type.startsWith('image/');

    if (isImage) {
      if (previewContainer) previewContainer.style.display = 'block';
      base64data = await blobToBase64(file);
      mimeType = file.type;
      
      if (imagePreview) {
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.style.display = 'block';
      }
      
      if (statusEl) statusEl.textContent = `Image loaded for editing.`;
      if (generateButton) generateButton.disabled = currentPromptText.trim() === '';
    } else {
      clearPreview();
      if (statusEl) statusEl.textContent = 'Unsupported file. Please upload an image.';
      showErrorModal(['Only image files are supported.'], 'Unsupported File Type');
    }
}

function blobToBase64(blob: Blob) {
  return new Promise<string>(async (resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      resolve(url.split(',')[1]);
    };
    reader.readAsDataURL(blob);
  });
}

async function generateImageContent() {
    const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
    const aspectRatio = userSettings.imageAspectRatio;
    let imageUrl: string;

    if (base64data && mimeType) { // Image editing
        if (statusEl) statusEl.innerText = 'Applying your edits...';
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [ { inlineData: { data: base64data, mimeType: mimeType } }, { text: currentPromptText } ] },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
        });
        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (!imagePart?.inlineData) throw new Error('Model did not return an image.');
        imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        if (statusEl) statusEl.innerText = 'Image edited successfully!';
    } else { // Text-to-image
        if (statusEl) statusEl.innerText = 'Generating your image...';
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: currentPromptText,
            config: { 
                numberOfImages: 1, 
                outputMimeType: userSettings.imageFormat as 'image/jpeg' | 'image/png', 
                aspectRatio: aspectRatio as '1:1' | '3:4' | '4:3' | '9:16' | '16:9'
            },
        });
        if (!response.generatedImages?.length) throw new Error('No images were generated.');
        const mime = userSettings.imageFormat;
        imageUrl = `data:${mime};base64,${response.generatedImages[0].image.imageBytes}`;
        if (statusEl) statusEl.innerText = 'Image generated successfully!';
    }
    
    if (resultImage) {
        resultImage.src = imageUrl;
        resultImage.style.display = 'block';
    }
    if (resultsContainer) resultsContainer.style.display = 'block';
    if (imageFiltersContainer) imageFiltersContainer.style.display = 'block';
    if (saveCreationButton) saveCreationButton.disabled = false;
    if (shareButton) shareButton.disabled = false;
    if (viewCreationButton) viewCreationButton.disabled = false;
    currentCreation = { data: imageUrl, type: 'image' };
}

async function generate() {
  if (currentPromptText.trim() === '') {
    showErrorModal(['Please enter a prompt.']); return;
  }

  if (spinnerContainer) spinnerContainer.style.display = 'flex';
  if (statusEl) statusEl.innerText = '';
  if (resultsContainer) resultsContainer.style.display = 'none';
  if (imageFiltersContainer) imageFiltersContainer.style.display = 'none';
  if (resultImage) {
      resultImage.src = '';
      resultImage.style.filter = 'none';
  }
  
  // Reset filter state
  currentFilter = 'none';
  if (filterOptionsContainer) {
      filterOptionsContainer.querySelector('.active')?.classList.remove('active');
      filterOptionsContainer.querySelector('[data-filter="none"]')?.classList.add('active');
  }

  if (saveCreationButton) saveCreationButton.disabled = true;
  if (shareButton) shareButton.disabled = true;
  if (viewCreationButton) viewCreationButton.disabled = true;

  setControlsDisabled(true);

  try {
    await generateImageContent();
  } catch (e) {
    console.error(`Image generation failed:`, e);
    
    let rawErrorMessage = 'An unknown error occurred.';
    if (e instanceof Error) {
        rawErrorMessage = e.message;
    } else if (typeof e === 'string') {
        rawErrorMessage = e;
    } else if (typeof e === 'object' && e !== null) {
        rawErrorMessage = JSON.stringify(e);
    }

    if (rawErrorMessage.toLowerCase().includes('quota exceeded') || rawErrorMessage.toLowerCase().includes('resource_exhausted')) {
        showErrorModal(
            [
                'The API key has reached its usage limit. Please check your Google AI Studio account for details on your quota.',
            ],
            'API Quota Exceeded'
        );
    } else {
        showErrorModal(
            [
                'We could not generate the picture as it may have violated our safety policies or referenced copyrighted material. Please adjust your prompt and try again.',
            ],
            'Generation Unsuccessful'
        );
    }
    
    if (statusEl) statusEl.innerText = `Generation failed. Please try a new prompt.`;
  } finally {
    if (spinnerContainer) spinnerContainer.style.display = 'none';
    setControlsDisabled(false);
  }
}

async function handleAiAssist() {
    if (!promptEl || promptEl.value.trim() === '') return;

    aiAssistButton.classList.add('loading');
    setControlsDisabled(true);

    try {
        const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
        const userPrompt = promptEl.value;
        
        const enhancementPrompt = `You are a creative assistant and expert prompt engineer for generative AI models. Your task is to take a user's simple prompt and enhance it to be more vivid, descriptive, and detailed, leading to a higher quality and more artistic generation. Add details about style (e.g., hyperrealistic, cinematic, oil painting), lighting (e.g., soft morning light, dramatic chiaroscuro), composition (e.g., wide-angle shot, rule of thirds), and mood. Only return the enhanced prompt, without any conversational text, labels, or explanation.

User's prompt: "${userPrompt}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: enhancementPrompt,
        });
        
        const enhancedText = response.text.trim().replace(/^"|"$/g, ''); // Remove quotes if model adds them

        if (enhancedText) {
            promptEl.value = enhancedText;
            promptEl.dispatchEvent(new Event('input', { bubbles: true }));
            showSettingsToast('Prompt enhanced with AI!');
        } else {
            throw new Error('AI did not return an enhanced prompt.');
        }

    } catch (e) {
        console.error('AI Assist failed:', e);
        showErrorModal([(e as Error).message], 'AI Assist Failed');
    } finally {
        aiAssistButton.classList.remove('loading');
        setControlsDisabled(false);
    }
}


// --- Settings Modal Logic ---
function setupSettingsNavigation() {
    settingsNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            const paneId = link.dataset.pane;
            
            // Update nav links
            settingsNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Update panes
            settingsPanes.forEach(pane => {
                pane.classList.toggle('active', pane.id === `pane-${paneId}`);
            });
        });
    });
}

function openSettingsModal() {
    if (!settingsModal || !currentUser) return;
    
    // Populate Profile
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userProfile = users[currentUser]?.profile;
    if (userProfile) {
        if (profilePicturePreview) profilePicturePreview.src = userProfile.avatar;
        if (profileNameInput) profileNameInput.value = users[currentUser].name;
        if (profileBioInput) profileBioInput.value = userProfile.bio;
        if (facebookLinkInput) facebookLinkInput.value = userProfile.links.facebook;
        if (xLinkInput) xLinkInput.value = userProfile.links.x;
        if (instagramLinkInput) instagramLinkInput.value = userProfile.links.instagram;
    }

    // Populate Subscription & Payments
    renderSubscriptionStatus();
    renderSavedCards();
    toggleAddCardView(false); // Ensure card list is shown by default

    // Populate Generation Settings
    if (settingImageAspectRatioSelect) settingImageAspectRatioSelect.value = userSettings.imageAspectRatio;
    if (settingImageFormatSelect) settingImageFormatSelect.value = userSettings.imageFormat;

    // Populate Domain
    renderDomainStatus();

    // Populate Notifications
    if (settingNotificationsFeatures) settingNotificationsFeatures.checked = userSettings.notifications.featureUpdates;
    if (settingNotificationsExports) settingNotificationsExports.checked = userSettings.notifications.exportAlerts;
    if (settingNotificationsCommunity) settingNotificationsCommunity.checked = userSettings.notifications.communityNews;

    // Populate Appearance
    if (settingDarkModeToggle) settingDarkModeToggle.checked = userSettings.theme === 'dark';


    // Populate Language & Region
    if (settingLanguageSelect) settingLanguageSelect.value = userSettings.language;
    if (settingTimezoneSelect) settingTimezoneSelect.value = userSettings.timezone;

    // Check creator application status
    const creatorApps = JSON.parse(localStorage.getItem('creator_applications') || '{}');
    if (creatorApps[currentUser]) {
        if (creatorProgramForm) creatorProgramForm.style.display = 'none';
        if (creatorAppliedMessage) creatorAppliedMessage.style.display = 'block';
    } else {
        if (creatorProgramForm) creatorProgramForm.style.display = 'block';
        if (creatorAppliedMessage) creatorAppliedMessage.style.display = 'none';
        (creatorProgramForm as HTMLFormElement)?.reset();
    }
    
    // Reset to the first pane
    settingsNavLinks.forEach((link, index) => link.classList.toggle('active', index === 0));
    settingsPanes.forEach((pane, index) => pane.classList.toggle('active', index === 0));


    settingsModal.style.display = 'flex';
}

function handleProfileUpdate(e: Event) {
    e.preventDefault();
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[currentUser]) {
        users[currentUser].name = profileNameInput.value;
        users[currentUser].profile.bio = profileBioInput.value;
        // Avatar is handled separately in handleAvatarChange
        localStorage.setItem('users', JSON.stringify(users));
        sessionStorage.setItem('currentUserName', profileNameInput.value);
        currentUserName = profileNameInput.value;
        if(userNameDisplay) userNameDisplay.textContent = currentUserName;
        showSettingsToast('Profile updated!');
    }
}

async function handleAvatarChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!currentUser || !file) return;

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[currentUser]?.profile) {
        const newAvatarUrl = `data:${file.type};base64,${await blobToBase64(file)}`;
        users[currentUser].profile.avatar = newAvatarUrl;
        localStorage.setItem('users', JSON.stringify(users));
        if (profilePicturePreview) profilePicturePreview.src = newAvatarUrl;
        if (dashboardProfilePicture) dashboardProfilePicture.src = newAvatarUrl;
        showSettingsToast('Avatar updated!');
    }
}

async function handleLinksUpdate(e: Event) {
    e.preventDefault();
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[currentUser]) {
        users[currentUser].profile.links = {
            facebook: facebookLinkInput.value,
            x: xLinkInput.value,
            instagram: instagramLinkInput.value,
        };
        localStorage.setItem('users', JSON.stringify(users));
        showSettingsToast('Social links updated!');
    }
}

async function handlePasswordUpdate(e: Event) {
    e.preventDefault();
    if (!currentUser) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentUser];
    
    if (user && user.password === currentPasswordInput.value) {
        if (newPasswordInput.value.length < 6) {
            showErrorModal(['New password must be at least 6 characters long.'], 'Update Failed');
            return;
        }
        if (newPasswordInput.value !== confirmPasswordInput.value) {
            showErrorModal(['New passwords do not match.'], 'Update Failed');
            return;
        }
        
        user.password = newPasswordInput.value;
        localStorage.setItem('users', JSON.stringify(users));
        showSettingsToast('Password updated successfully!');
        (e.target as HTMLFormElement).reset();
    } else {
        showErrorModal(['Current password is incorrect.'], 'Update Failed');
    }
}

// --- Restored Application Logic ---

function handleGenerationSettingsUpdate(e: Event) {
    e.preventDefault();
    if(settingImageAspectRatioSelect) userSettings.imageAspectRatio = settingImageAspectRatioSelect.value;
    if(settingImageFormatSelect) userSettings.imageFormat = settingImageFormatSelect.value;
    saveUserSettings();
    applyUserSettingsToDashboard();
    showSettingsToast('Generation settings saved!');
}

function handleDomainUpdate(e: Event) {
    e.preventDefault();
    if(!domainNameInput) return;
    const newDomain = domainNameInput.value.trim();
    if (newDomain && currentUser) {
        userSettings.domain.name = newDomain;
        // Simulate a check by setting status to pending
        userSettings.domain.status = 'pending';
        saveUserSettings();
        renderDomainStatus();
        showSettingsToast('Domain update initiated. Verification is pending.');
    } else if (!newDomain) {
        userSettings.domain.name = '';
        userSettings.domain.status = 'disconnected';
        saveUserSettings();
        renderDomainStatus();
        showSettingsToast('Domain disconnected.');
    }
}

function handleNotificationsUpdate(e: Event) {
    e.preventDefault();
    userSettings.notifications = {
        featureUpdates: settingNotificationsFeatures.checked,
        exportAlerts: settingNotificationsExports.checked,
        communityNews: settingNotificationsCommunity.checked,
    };
    saveUserSettings();
    showSettingsToast('Notification preferences saved!');
}

function handleAppearanceUpdate() {
    if(!settingDarkModeToggle) return;
    userSettings.theme = settingDarkModeToggle.checked ? 'dark' : 'light';
    saveUserSettings();
    applyTheme();
}

function handleLanguageRegionUpdate(e: Event) {
    e.preventDefault();
    if(settingLanguageSelect) userSettings.language = settingLanguageSelect.value;
    if(settingTimezoneSelect) userSettings.timezone = settingTimezoneSelect.value;
    saveUserSettings();
    showSettingsToast('Language and region settings saved!');
}

function handleCreatorProgramSubmit(e: Event) {
    e.preventDefault();
    if (!currentUser || !creatorNameInput || !creatorLinkInput || !creatorReasonInput) return;
    const creatorApps = JSON.parse(localStorage.getItem('creator_applications') || '{}');
    creatorApps[currentUser] = {
        name: creatorNameInput.value,
        link: creatorLinkInput.value,
        reason: creatorReasonInput.value,
        date: new Date().toISOString(),
    };
    localStorage.setItem('creator_applications', JSON.stringify(creatorApps));
    
    if (creatorProgramForm) creatorProgramForm.style.display = 'none';
    if (creatorAppliedMessage) creatorAppliedMessage.style.display = 'block';
    showSettingsToast('Application submitted! We will review it shortly.');
}

function handleClearCache() {
    if (currentUser) {
        // This is a simulation, in a real app you'd clear specific cache keys
        localStorage.removeItem(`reset_${currentUser}`);
        showSettingsToast('Temporary data cleared!');
    }
}

function handleDeleteAccount() {
    if (deleteAccountModal && deleteConfirmInput && currentUser) {
        deleteConfirmInput.value = '';
        deleteConfirmInput.placeholder = currentUser;
        if(confirmDeleteButton) confirmDeleteButton.disabled = true;
        toggleModal(deleteAccountModal, true);
    }
}

function handleConfirmDelete() {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    delete users[currentUser];
    localStorage.setItem('users', JSON.stringify(users));
    
    // Clean up all user-related data
    localStorage.removeItem(`user_${currentUser}`);
    localStorage.removeItem(`settings_${currentUser}`);
    localStorage.removeItem(`creations_${currentUser}`);
    localStorage.removeItem(`conversations_${currentUser}`);

    // Redirect to login screen with a message
    window.location.search = '?message=account_deleted';
}

// --- Creation Management ---

function getCreationsFromLocalStorage(): any[] {
    if (!currentUser) return [];
    try {
        return JSON.parse(localStorage.getItem(`creations_${currentUser}`) || '[]');
    } catch(e) {
        return [];
    }
}

function saveCreationsToLocalStorage(creations: any[]) {
    if (!currentUser) return;
    localStorage.setItem(`creations_${currentUser}`, JSON.stringify(creations));
}

function saveCreation() {
    if (userState.isPremium) {
        if (!currentCreation.data) {
            showErrorModal(['There is no creation to save.'], 'Save Error');
            return;
        }
        const creations = getCreationsFromLocalStorage();
        const newCreation = {
            id: `creation-${Date.now()}`,
            ...currentCreation,
            prompt: currentPromptText,
            date: new Date().toISOString(),
        };
        creations.unshift(newCreation);
        saveCreationsToLocalStorage(creations);
        showSettingsToast('Creation saved successfully!', 'success');
    } else {
        showErrorModal(['Saving creations is a Premium feature. Please upgrade your plan.'], 'Upgrade Required');
    }
}

function renderCreations(page = 1) {
    if (!creationsGallery) return;

    const allCreations = getCreationsFromLocalStorage();
    creationsGallery.innerHTML = '';

    const totalCreations = allCreations.length;
    if (totalCreations === 0) {
        creationsGallery.innerHTML = '<p style="text-align: center; color: var(--subtle-text-color);">You haven\'t saved any creations yet.</p>';
        if (creationsPaginationControls) creationsPaginationControls.style.display = 'none';
        return;
    }

    const totalPages = Math.ceil(totalCreations / CREATIONS_PER_PAGE);
    creationsCurrentPage = Math.max(1, Math.min(page, totalPages));

    const startIndex = (creationsCurrentPage - 1) * CREATIONS_PER_PAGE;
    const endIndex = startIndex + CREATIONS_PER_PAGE;
    const pageCreations = allCreations.slice(startIndex, endIndex);

    pageCreations.forEach(creation => {
        const item = document.createElement('div');
        item.className = 'creation-item';
        item.dataset.id = creation.id;
        item.innerHTML = `
            <a href="#" class="creation-media-wrapper" data-media-url="${creation.data}" title="Click to view larger">
                <img src="${creation.data}" alt="${creation.prompt}" loading="lazy">
                <div class="creation-overlay">${creation.prompt}</div>
            </a>
        `;
        creationsGallery.appendChild(item);
    });

    if (creationsPaginationControls) {
        creationsPaginationControls.style.display = totalPages > 1 ? 'flex' : 'none';
    }
    if (creationsPageInfo) {
        creationsPageInfo.textContent = `Page ${creationsCurrentPage} of ${totalPages}`;
    }
    if (creationsPrevPageButton) {
        creationsPrevPageButton.disabled = creationsCurrentPage === 1;
    }
    if (creationsNextPageButton) {
        creationsNextPageButton.disabled = creationsCurrentPage === totalPages;
    }
}

function openCreationsModal() {
    if (userState.isPremium) {
        renderCreations(1);
        if (creationsModal) creationsModal.style.display = 'flex';
    } else {
        showErrorModal(['Viewing your creations gallery is a Premium feature.'], 'Upgrade Required');
    }
}

// A simple function to toggle any modal
function toggleModal(modal: HTMLElement | null, show: boolean) {
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
    }
}

// --- App Initialization & Event Listeners ---

function setupEventListeners() {
    // Auth
    loginForm?.addEventListener('submit', handleLogin);
    registerForm?.addEventListener('submit', handleRegister);
    forgotPasswordForm?.addEventListener('submit', handleForgotPasswordRequest);
    resetPasswordForm?.addEventListener('submit', handlePasswordReset);
    authToggleLink?.addEventListener('click', (e) => {
        e.preventDefault();
        const mode = (e.currentTarget as HTMLElement).dataset.mode as 'login' | 'register';
        switchAuthView(mode);
    });
    forgotPasswordLink?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthView('forgot');
    });

    // Main UI
    subscribeButton?.addEventListener('click', () => toggleModal(subscriptionModal, true));
    promptEl?.addEventListener('input', () => {
        if(promptEl) currentPromptText = promptEl.value;
        if (generateButton) generateButton.disabled = currentPromptText.trim() === '' && !base64data;
    });
    generateButton?.addEventListener('click', generate);
    aiAssistButton?.addEventListener('click', handleAiAssist);
    upload?.addEventListener('change', handleFileUpload);
    clearPreviewButton?.addEventListener('click', clearPreview);
    downloadButton?.addEventListener('click', () => {
        if (resultImage?.src && resultImage.src !== window.location.href) {
            const a = document.createElement('a');
            a.href = resultImage.src;
            const format = userSettings.imageFormat.split('/')[1] || 'jpeg';
            a.download = `semo-creation-${Date.now()}.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });
    saveCreationButton?.addEventListener('click', saveCreation);
    viewCreationButton?.addEventListener('click', () => {
        if(currentCreation.data && largeViewModal && largeViewImage){
            largeViewImage.src = currentCreation.data;
            largeViewImage.style.display = 'block';
            if (largeViewVideo) largeViewVideo.style.display = 'none';
            toggleModal(largeViewModal, true);
        }
    });
    
    // Filters
    filterOptionsContainer?.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        if (target.classList.contains('filter-button')) {
            filterOptionsContainer.querySelector('.active')?.classList.remove('active');
            target.classList.add('active');
            currentFilter = target.dataset.filter || 'none';
            if (resultImage) {
                resultImage.style.filter = currentFilter;
            }
        }
    });

    // Profile & Modals
    profileButton?.addEventListener('click', () => {
        if (profileDropdown) profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', (e) => {
        if (profileDropdown && !profileContainer?.contains(e.target as Node)) {
            profileDropdown.style.display = 'none';
        }
    });
    logoutButton?.addEventListener('click', (e) => { e.preventDefault(); handleLogout(); });
    settingsButton?.addEventListener('click', (e) => { e.preventDefault(); openSettingsModal(); });
    myCreationsButton?.addEventListener('click', (e) => { e.preventDefault(); openCreationsModal(); });
    modalCloseButton?.addEventListener('click', () => toggleModal(errorModal, false));
    subscriptionModalCloseButton?.addEventListener('click', () => toggleModal(subscriptionModal, false));
    settingsModalCloseButton?.addEventListener('click', () => toggleModal(settingsModal, false));
    creationsModalCloseButton?.addEventListener('click', () => toggleModal(creationsModal, false));
    largeViewCloseButton?.addEventListener('click', () => toggleModal(largeViewModal, false));
    shareFallbackCloseButton?.addEventListener('click', () => toggleModal(shareFallbackModal, false));

    // Settings
    setupSettingsNavigation();
    profileForm?.addEventListener('submit', handleProfileUpdate);
    profilePictureInput?.addEventListener('change', handleAvatarChange);
    linksForm?.addEventListener('submit', handleLinksUpdate);
    passwordForm?.addEventListener('submit', handlePasswordUpdate);
    generationSettingsForm?.addEventListener('submit', handleGenerationSettingsUpdate);
    notificationsForm?.addEventListener('submit', handleNotificationsUpdate);
    settingDarkModeToggle?.addEventListener('change', handleAppearanceUpdate);
    languageRegionForm?.addEventListener('submit', handleLanguageRegionUpdate);
    creatorProgramForm?.addEventListener('submit', handleCreatorProgramSubmit);
    domainForm?.addEventListener('submit', handleDomainUpdate);

    // Privacy & Security
    clearCacheButton?.addEventListener('click', handleClearCache);
    deleteAccountButton?.addEventListener('click', handleDeleteAccount);
    cancelDeleteButton?.addEventListener('click', () => toggleModal(deleteAccountModal, false));
    deleteConfirmInput?.addEventListener('input', () => {
        if (confirmDeleteButton && deleteConfirmInput) confirmDeleteButton.disabled = deleteConfirmInput.value !== currentUser;
    });
    confirmDeleteButton?.addEventListener('click', handleConfirmDelete);
    
    // Payment
    pricingPlans.forEach(plan => {
        plan.addEventListener('click', () => handlePlanSelection(plan as HTMLDivElement));
    });
    continuePaymentButton?.addEventListener('click', showPaymentSelectionView);
    backToPlansButton?.addEventListener('click', () => {
        if (planSelectionView) planSelectionView.style.display = 'block';
        if (paymentSelectionView) paymentSelectionView.style.display = 'none';
    });
    paypalPaymentButton?.addEventListener('click', handlePayPalPayment);


    // Nav
    imageNavButton?.addEventListener('click', () => {
        if(imageGeneratorView) imageGeneratorView.style.display = 'flex';
        if(chatView) chatView.style.display = 'none';
        imageNavButton.classList.add('active');
        chatNavButton?.classList.remove('active');
    });
    chatNavButton?.addEventListener('click', () => {
        if(imageGeneratorView) imageGeneratorView.style.display = 'none';
        if(chatView) chatView.style.display = 'flex';
        chatNavButton.classList.add('active');
        imageNavButton?.classList.remove('active');
    });

    // Chat
    newChatButton?.addEventListener('click', handleNewChat);
    chatForm?.addEventListener('submit', handleChatSubmit);
    chatInput?.addEventListener('input', () => {
       if (chatSendButton && chatInput) chatSendButton.disabled = chatInput.value.trim() === '';
    });
    chatInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (chatInput && chatInput.value.trim() !== '') handleChatSubmit();
        }
    });

    // Daily Prompts
    refreshPromptsButton?.addEventListener('click', populateDailyPrompts);

    // Creations
    creationsPrevPageButton?.addEventListener('click', () => renderCreations(creationsCurrentPage - 1));
    creationsNextPageButton?.addEventListener('click', () => renderCreations(creationsCurrentPage + 1));
    creationsGallery?.addEventListener('click', e => {
        const wrapper = (e.target as HTMLElement).closest('.creation-media-wrapper');
        if (wrapper && largeViewModal && largeViewImage) {
            e.preventDefault();
            const mediaUrl = wrapper.getAttribute('data-media-url');
            if (mediaUrl) {
                largeViewImage.src = mediaUrl;
                largeViewImage.style.display = 'block';
                if (largeViewVideo) largeViewVideo.style.display = 'none';
                toggleModal(largeViewModal, true);
            }
        }
    });

    // Guides
    showGcpGuideLink?.addEventListener('click', (e) => { e.preventDefault(); toggleModal(gcpGuideModal, true); });
    gcpGuideCloseButton?.addEventListener('click', () => toggleModal(gcpGuideModal, false));
    showNamecheapGuideLink?.addEventListener('click', (e) => { e.preventDefault(); toggleModal(namecheapGuideModal, true); });
    namecheapGuideCloseButton?.addEventListener('click', () => toggleModal(namecheapGuideModal, false));
    
    // Drag and Drop
    mainContent?.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        mainContent.classList.add('drag-over');
    });
    mainContent?.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        mainContent.classList.remove('drag-over');
    });
    mainContent?.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        mainContent.classList.remove('drag-over');
        if (e.dataTransfer?.files[0]) {
            if (upload) {
                upload.files = e.dataTransfer.files;
                upload.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    });
}

function initializeApp() {
    cacheDOMElements();

    if (!GEMINI_API_KEY) {
        console.error('Gemini API key is not set. Please create a .env file with API_KEY=YOUR_API_KEY');
        const configErrorModal = document.getElementById('config-error-overlay');
        toggleModal(configErrorModal, true);
        return;
    }
    
    setupEventListeners();
    setupAuthLegalTabs();
    checkAuthStatus();

    setTimeout(() => {
        if(splashScreen) {
            splashScreen.classList.add('hidden');
        }
    }, 1200);
}

document.addEventListener('DOMContentLoaded', initializeApp);
