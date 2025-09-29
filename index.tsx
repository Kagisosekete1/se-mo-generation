/* tslint:disable */
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {GoogleGenAI, Modality} from '@google/genai';

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
    videoQuality: 'standard',
    motionBlurStrength: 0.5,
    imageAspectRatio: '1:1',
    imageFormat: 'image/jpeg',
    watermark: true,
    notifications: {
        featureUpdates: true,
        exportAlerts: true,
        communityNews: true,
    },
    theme: 'light',
    language: 'en-US',
    timezone: 'Africa/Johannesburg',
};
let generationType = 'video';
let currentCreation = {
    data: '',
    type: '', // 'video' or 'image'
};
let selectedPremiumPlan: 'monthly' | 'yearly' | null = null;
let base64data = '';
let mimeType = '';
let currentPromptText = '';

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
let generationTypeRadios: NodeListOf<HTMLInputElement>;
let videoSettings: HTMLDivElement;
let imageSettings: HTMLDivElement;
let imageAspectRatioSelect: HTMLSelectElement;
let imageFormatSelect: HTMLSelectElement;
let resultImage: HTMLImageElement;
let promptEl: HTMLTextAreaElement;
let generateButton: HTMLButtonElement;
let aiAssistButton: HTMLButtonElement;
let statusEl: HTMLDivElement;
let spinnerContainer: HTMLDivElement;
let video: HTMLVideoElement;
let durationSlider: HTMLInputElement;
let durationValue: HTMLSpanElement;
let qualitySelect: HTMLSelectElement;
let examplePromptsSelect: HTMLSelectElement;
let videoAspectRatioSelect: HTMLSelectElement;
let upload: HTMLInputElement;
let fileNameDisplay: HTMLSpanElement;

// Preview Elements
let previewContainer: HTMLDivElement;
let imagePreview: HTMLImageElement;
let videoPreview: HTMLVideoElement;
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
let shareFallbackModal: HTMLDivElement;
let shareFallbackCloseButton: HTMLButtonElement;

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
let settingVideoQualitySelect: HTMLSelectElement;
let settingMotionBlurSlider: HTMLInputElement;
let settingMotionBlurValue: HTMLSpanElement;
let settingImageAspectRatioSelect: HTMLSelectElement;
let settingImageFormatSelect: HTMLSelectElement;
let settingWatermarkToggle: HTMLInputElement;
let watermarkSettingContainer: HTMLDivElement;
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

// Privacy & Security Elements
let manageProjectsButton: HTMLButtonElement;
let clearCacheButton: HTMLButtonElement;
let deleteAccountButton: HTMLButtonElement;
let deleteAccountModal: HTMLDivElement;
let deleteConfirmInput: HTMLInputElement;
let cancelDeleteButton: HTMLButtonElement;
let confirmDeleteButton: HTMLButtonElement;

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
let modalCardsListContainer: HTMLDivElement;
let modalAddCardButton: HTMLButtonElement;
let modalAddCardForm: HTMLFormElement;
let confirmPaymentButton: HTMLButtonElement;
let modalCardNumberInput: HTMLInputElement;
let modalCardHolderInput: HTMLInputElement;
let modalCardExpiryInput: HTMLInputElement;
let modalCardCvvInput: HTMLInputElement;
let modalSetCardDefaultCheckbox: HTMLInputElement;
let modalCancelAddCardButton: HTMLButtonElement;

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

// Custom Video Player Elements
let videoPlayerContainer: HTMLDivElement;
let playPauseBtn: HTMLButtonElement;
let playBtnIcon: SVGElement;
let pauseBtnIcon: SVGElement;
let progressBar: HTMLInputElement;
let currentTimeEl: HTMLSpanElement;
let totalTimeEl: HTMLSpanElement;
let volumeBtn: HTMLButtonElement;
let volumeHighIcon: SVGElement;
let volumeMutedIcon: SVGElement;
let volumeSlider: HTMLInputElement;
let speedBtn: HTMLButtonElement;
let speedOptionsContainer: HTMLDivElement;
let fullscreenBtn: HTMLButtonElement;
let fullscreenOpenIcon: SVGElement;
let fullscreenCloseIcon: SVGElement;


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
    authLegalTabs = document.querySelectorAll('.auth-legal-tab');
    authLegalPanes = document.querySelectorAll('.auth-legal-pane');


    // Main UI
    userStatusEl = document.querySelector('#user-status') as HTMLSpanElement;
    subscribeButton = document.querySelector('#subscribe-button') as HTMLButtonElement;
    resultsContainer = document.querySelector('#results-container') as HTMLDivElement;
    downloadButton = document.querySelector('#download-button') as HTMLButtonElement;
    saveCreationButton = document.querySelector('#save-creation-button') as HTMLButtonElement;
    shareButton = document.querySelector('#share-button') as HTMLButtonElement;
    viewCreationButton = document.querySelector('#view-creation-button') as HTMLButtonElement;
    generationTypeRadios = document.querySelectorAll('input[name="generation-type"]');
    videoSettings = document.querySelector('#video-settings') as HTMLDivElement;
    imageSettings = document.querySelector('#image-settings') as HTMLDivElement;
    imageAspectRatioSelect = document.querySelector('#image-aspect-ratio-select') as HTMLSelectElement;
    imageFormatSelect = document.querySelector('#image-format-select') as HTMLSelectElement;
    resultImage = document.querySelector('#result-image') as HTMLImageElement;
    promptEl = document.querySelector('#prompt-input') as HTMLTextAreaElement;
    generateButton = document.querySelector('#generate-button') as HTMLButtonElement;
    aiAssistButton = document.querySelector('#ai-assist-button') as HTMLButtonElement;
    statusEl = document.querySelector('#status') as HTMLDivElement;
    spinnerContainer = document.querySelector('#spinner-container') as HTMLDivElement;
    video = document.querySelector('#video') as HTMLVideoElement;
    durationSlider = document.querySelector('#duration-slider') as HTMLInputElement;
    durationValue = document.querySelector('#duration-value') as HTMLSpanElement;
    qualitySelect = document.querySelector('#quality-select') as HTMLSelectElement;
    examplePromptsSelect = document.querySelector('#example-prompts-select') as HTMLSelectElement;
    videoAspectRatioSelect = document.querySelector('#aspect-ratio-select') as HTMLSelectElement;
    upload = document.querySelector('#file-input') as HTMLInputElement;
    fileNameDisplay = document.querySelector('#file-name-display') as HTMLSpanElement;

    // Preview
    previewContainer = document.querySelector('#preview-container') as HTMLDivElement;
    imagePreview = document.querySelector('#image-preview') as HTMLImageElement;
    videoPreview = document.querySelector('#video-preview') as HTMLVideoElement;
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
    shareFallbackModal = document.querySelector('#share-fallback-modal') as HTMLDivElement;
    shareFallbackCloseButton = document.querySelector('#share-fallback-close-button') as HTMLButtonElement;

    // Daily Prompts Section
    dailyPromptsContainer = document.querySelector('#daily-prompts-container') as HTMLDivElement;
    dailyPromptsGallery = document.querySelector('#daily-prompts-gallery') as HTMLDivElement;
    refreshPromptsButton = document.querySelector('#refresh-prompts-button') as HTMLButtonElement;

    // Settings Modal
    settingsNavLinks = document.querySelectorAll('.settings-nav-link');
    settingsPanes = document.querySelectorAll('.settings-pane');
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
    settingVideoQualitySelect = document.querySelector('#setting-video-quality') as HTMLSelectElement;
    settingMotionBlurSlider = document.querySelector('#setting-motion-blur') as HTMLInputElement;
    settingMotionBlurValue = document.querySelector('#setting-motion-blur-value') as HTMLSpanElement;
    settingImageAspectRatioSelect = document.querySelector('#setting-image-aspect-ratio') as HTMLSelectElement;
    settingImageFormatSelect = document.querySelector('#setting-image-format') as HTMLSelectElement;
    settingWatermarkToggle = document.querySelector('#setting-watermark-toggle') as HTMLInputElement;
    watermarkSettingContainer = document.querySelector('#watermark-setting-container') as HTMLDivElement;
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


    // Privacy & Security
    manageProjectsButton = document.querySelector('#manage-projects-button') as HTMLButtonElement;
    clearCacheButton = document.querySelector('#clear-cache-button') as HTMLButtonElement;
    deleteAccountButton = document.querySelector('#delete-account-button') as HTMLButtonElement;
    deleteAccountModal = document.querySelector('#delete-account-modal') as HTMLDivElement;
    deleteConfirmInput = document.querySelector('#delete-confirm-input') as HTMLInputElement;
    cancelDeleteButton = document.querySelector('#cancel-delete-button') as HTMLButtonElement;
    confirmDeleteButton = document.querySelector('#confirm-delete-button') as HTMLButtonElement;

    // Large View Modal
    largeViewModal = document.querySelector('#large-view-modal') as HTMLDivElement;
    largeViewImage = document.querySelector('#large-view-image') as HTMLImageElement;
    largeViewVideo = document.querySelector('#large-view-video') as HTMLVideoElement;
    largeViewCloseButton = document.querySelector('#large-view-close-button') as HTMLButtonElement;
    
    // Payment
    pricingPlans = document.querySelectorAll('.pricing-plan');
    continuePaymentButton = document.querySelector('#continue-payment-button') as HTMLButtonElement;
    paymentMessageContainer = document.querySelector('#payment-message-container') as HTMLDivElement;
    planSelectionView = document.querySelector('#plan-selection-view') as HTMLDivElement;
    paymentSelectionView = document.querySelector('#payment-selection-view') as HTMLDivElement;
    selectedPlanInfo = document.querySelector('#selected-plan-info') as HTMLParagraphElement;
    backToPlansButton = document.querySelector('#back-to-plans-button') as HTMLButtonElement;
    modalCardsListContainer = document.querySelector('#modal-cards-list-container') as HTMLDivElement;
    modalAddCardButton = document.querySelector('#modal-add-card-button') as HTMLButtonElement;
    modalAddCardForm = document.querySelector('#modal-add-card-form') as HTMLFormElement;
    confirmPaymentButton = document.querySelector('#confirm-payment-button') as HTMLButtonElement;
    modalCardNumberInput = document.querySelector('#modal-card-number-input') as HTMLInputElement;
    modalCardHolderInput = document.querySelector('#modal-card-holder-input') as HTMLInputElement;
    modalCardExpiryInput = document.querySelector('#modal-card-expiry-input') as HTMLInputElement;
    modalCardCvvInput = document.querySelector('#modal-card-cvv-input') as HTMLInputElement;
    modalSetCardDefaultCheckbox = document.querySelector('#modal-set-card-default-checkbox') as HTMLInputElement;
    modalCancelAddCardButton = document.querySelector('#modal-cancel-add-card-button') as HTMLButtonElement;

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
    
    // Custom Video Player
    videoPlayerContainer = document.querySelector('.video-player-container') as HTMLDivElement;
    playPauseBtn = document.querySelector('#play-pause-btn') as HTMLButtonElement;
    playBtnIcon = document.querySelector('#play-btn-icon') as SVGElement;
    pauseBtnIcon = document.querySelector('#pause-btn-icon') as SVGElement;
    progressBar = document.querySelector('.progress-bar') as HTMLInputElement;
    currentTimeEl = document.querySelector('#current-time') as HTMLSpanElement;
    totalTimeEl = document.querySelector('#total-time') as HTMLSpanElement;
    volumeBtn = document.querySelector('#volume-btn') as HTMLButtonElement;
    volumeHighIcon = document.querySelector('#volume-high-icon') as SVGElement;
    volumeMutedIcon = document.querySelector('#volume-muted-icon') as SVGElement;
    volumeSlider = document.querySelector('.volume-slider') as HTMLInputElement;
    speedBtn = document.querySelector('#speed-btn') as HTMLButtonElement;
    speedOptionsContainer = document.querySelector('.speed-options') as HTMLDivElement;
    fullscreenBtn = document.querySelector('#fullscreen-btn') as HTMLButtonElement;
    fullscreenOpenIcon = document.querySelector('#fullscreen-open-icon') as SVGElement;
    fullscreenCloseIcon = document.querySelector('#fullscreen-close-icon') as SVGElement;
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
        paymentMethods: []
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
        videoQuality: savedSettings.videoQuality || 'standard',
        motionBlurStrength: savedSettings.motionBlurStrength !== undefined ? savedSettings.motionBlurStrength : 0.5,
        imageAspectRatio: savedSettings.imageAspectRatio || '1:1',
        imageFormat: savedSettings.imageFormat || 'image/jpeg',
        watermark: savedSettings.watermark !== undefined ? savedSettings.watermark : !userState.isPremium,
        notifications: savedSettings.notifications || {
            featureUpdates: true,
            exportAlerts: true,
            communityNews: true,
        },
        theme: savedSettings.theme || 'light',
        language: savedSettings.language || 'en-US',
        timezone: savedSettings.timezone || 'Africa/Johannesburg',
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
    if (qualitySelect) qualitySelect.value = userSettings.videoQuality;
    if (imageAspectRatioSelect) imageAspectRatioSelect.value = userSettings.imageAspectRatio;
    if (imageFormatSelect) imageFormatSelect.value = userSettings.imageFormat;
}


function updateUserStatusUI() {
  if (userState.isPremium) {
    if (userStatusEl) {
        userStatusEl.innerHTML = `<span class="premium-badge">Premium</span> Unlimited Generations`;
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

// --- Payment ---
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
    planSelectionView.style.display = 'none';
    paymentSelectionView.style.display = 'block';
    
    const planName = selectedPremiumPlan.charAt(0).toUpperCase() + selectedPremiumPlan.slice(1);
    const planPrice = selectedPremiumPlan === 'monthly' ? '$9.99' : '$99.99';
    const planDuration = selectedPremiumPlan === 'monthly' ? '/ month' : '/ year';

    selectedPlanInfo.textContent = `Selected Plan: ${planName} (${planPrice}${planDuration})`;
    if (confirmPaymentButton) confirmPaymentButton.textContent = `Pay ${planPrice}`;
    
    populateModalCardsList();
}

function populateModalCardsList() {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const cards = users[currentUser]?.paymentMethods || [];

    if (cards.length > 0) {
        modalCardsListContainer.innerHTML = '';
        cards.forEach((card, index) => {
             let logoUrl = '';
            const cardTypeLower = card.type.toLowerCase();
            if (cardTypeLower === 'visa') {
                logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg';
            } else if (cardTypeLower === 'mastercard') {
                logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg';
            }
            const isDefault = card.isDefault || index === 0;

            const cardLabel = document.createElement('label');
            cardLabel.className = 'modal-card-option';
            cardLabel.innerHTML = `
                <input type="radio" name="payment-method" value="${card.id}" ${isDefault ? 'checked' : ''}>
                <img src="${logoUrl}" class="card-icon" alt="${card.type}">
                <div class="card-info">
                    <div class="card-info-main">
                      <span>${card.type} ending in ${card.maskedNumber}</span>
                    </div>
                </div>
            `;
            modalCardsListContainer.appendChild(cardLabel);
        });

        modalCardsListContainer.style.display = 'flex';
        modalAddCardButton.style.display = 'block';
        modalAddCardForm.style.display = 'none';
    } else {
        // No cards saved, show the add card form directly
        modalCardsListContainer.style.display = 'none';
        modalAddCardButton.style.display = 'none';
        modalAddCardForm.style.display = 'block';
    }
}


async function handleConfirmPayment() {
  if (paymentMessageContainer) paymentMessageContainer.innerHTML = '';
  
  const selectedCard = modalCardsListContainer.querySelector('input[name="payment-method"]:checked');
  if (!selectedCard && modalAddCardForm.style.display === 'none') {
      showPaymentMessage('Please select a payment method.', 'error');
      return;
  }
  
  showPaymentMessage('Processing payment...', 'success');
  if (confirmPaymentButton) {
      confirmPaymentButton.disabled = true;
      confirmPaymentButton.classList.add('processing');
  }
  
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
        planSelectionView.style.display = 'block';
        paymentSelectionView.style.display = 'none';
      }
      if (confirmPaymentButton) {
          confirmPaymentButton.disabled = false;
          confirmPaymentButton.classList.remove('processing');
      }
      if (paymentMessageContainer) paymentMessageContainer.innerHTML = '';
      
      // Reset plan selection
      pricingPlans.forEach(plan => plan.classList.remove('selected'));
      selectedPremiumPlan = null;

    }, 2000);
  }, 1500);
}

function handleSaveCardInModal(e: Event) {
    e.preventDefault();
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[currentUser]) return;

    const cardNumber = modalCardNumberInput.value.replace(/\s/g, '');
    const shouldSave = modalSetCardDefaultCheckbox.checked;

    if (shouldSave) {
        const newCard = {
            id: Date.now(),
            type: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
            maskedNumber: cardNumber.slice(-4),
            holderName: modalCardHolderInput.value,
            isDefault: false, // Don't make default from this flow to avoid confusion
        };

        let cards = users[currentUser].paymentMethods || [];
        cards.push(newCard);
        users[currentUser].paymentMethods = cards;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // After saving (or not), refresh the list view
    populateModalCardsList();
}


// --- Generation ---
function handleGenerationTypeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    generationType = target.value;
    
    if (resultsContainer) resultsContainer.style.display = 'none';
    if (video) video.src = '';
    if (resultImage) resultImage.src = '';
    if (saveCreationButton) saveCreationButton.disabled = true;
    if (shareButton) shareButton.disabled = true;
    if (viewCreationButton) viewCreationButton.disabled = true;

    clearPreview();

    if (upload) upload.disabled = false;

    if (generationType === 'video') {
        if (videoSettings) videoSettings.style.display = 'block';
        if (imageSettings) imageSettings.style.display = 'none';
        if (generateButton) generateButton.textContent = 'Generate Video';
        if (downloadButton) downloadButton.textContent = 'Download Video';
    } else { // image
        if (videoSettings) videoSettings.style.display = 'none';
        if (imageSettings) imageSettings.style.display = 'block';
        if (generateButton) generateButton.textContent = 'Generate Image';
        if (downloadButton) downloadButton.textContent = 'Download Image';
    }
}

function clearPreview() {
    if (previewContainer) previewContainer.style.display = 'none';
    if (imagePreview) {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
    }
    if (videoPreview) {
        videoPreview.pause();
        videoPreview.src = '';
        videoPreview.style.display = 'none';
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
    const isVideo = file.type.startsWith('video/');

    if (isImage) {
      // Images can be used for both image and video generation
      if (previewContainer) previewContainer.style.display = 'block';
      base64data = await blobToBase64(file);
      mimeType = file.type;
      
      if (imagePreview) {
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.style.display = 'block';
      }
      if (videoPreview) {
        videoPreview.style.display = 'none';
        videoPreview.pause();
        videoPreview.src = '';
      }
      
      const modeText = generationType === 'image' ? 'for editing' : 'for video generation';
      if (statusEl) statusEl.textContent = `Image loaded ${modeText}.`;
      if (generateButton) generateButton.disabled = currentPromptText.trim() === '';
    } else if (isVideo) {
      // Videos are only for preview, and only in video generation mode.
      if (generationType === 'video') {
        if (previewContainer) previewContainer.style.display = 'block';
        base64data = '';
        mimeType = '';
        
        if (videoPreview) {
          videoPreview.src = URL.createObjectURL(file);
          videoPreview.style.display = 'block';
        }
        if (imagePreview) {
          imagePreview.style.display = 'none';
          imagePreview.src = '';
        }
        
        if (statusEl) statusEl.textContent = 'Video input is for preview only and not supported for generation.';
        if (generateButton) generateButton.disabled = true;
      } else { // Trying to drop a video in image mode
        clearPreview();
        if (statusEl) statusEl.textContent = 'Unsupported file. Please upload an image for image editing.';
      }
    } else {
      clearPreview();
      if (statusEl) statusEl.textContent = 'Unsupported file type.';
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

async function generateVideoContent(prompt, imageBytes, mimeType, durationSecs, quality, aspectRatio) {
  const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
  const config: any = { model: 'veo-2.0-generate-001', prompt, config: { numberOfVideos: 1, durationSeconds: durationSecs, quality, aspectRatio, motionBlurStrength: userSettings.motionBlurStrength }};
  if (imageBytes && mimeType) config.image = { imageBytes, mimeType };

  let operation = await ai.models.generateVideos(config);

  const generatingMessages = ['Warming up the pixels...', 'Choreographing the digital dancers...', 'Untangling the quantum film...'];
  let messageIndex = 0;
  if (statusEl) statusEl.innerText = generatingMessages[messageIndex];
  const messageInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % generatingMessages.length;
    if (statusEl) statusEl.innerText = generatingMessages[messageIndex];
  }, 3000);

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({operation});
  }
  clearInterval(messageInterval);

  const v = operation.response?.generatedVideos?.[0];
  if (!v || !v.video || !v.video.uri) throw new Error('No videos generated or video URI is missing.');

  if (statusEl) statusEl.innerText = 'Finalizing video...';
  
  const fetchUrl = `${v.video.uri}&key=${GEMINI_API_KEY}`;
  
  // Fetch the video data and create a Blob URL for reliable playback.
  try {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}. Details: ${errorText}`);
      }
      const videoBlob = await response.blob();
      const blobUrl = URL.createObjectURL(videoBlob);
        
      if (video) {
        // Use blob for immediate playback
        video.src = blobUrl;
        video.style.display = 'block';
      }
      if (resultImage) resultImage.style.display = 'none';
      if (resultsContainer) resultsContainer.style.display = 'block';
      if (statusEl) statusEl.innerText = 'Video generated successfully!';
      if (saveCreationButton) saveCreationButton.disabled = false;
      if (shareButton) shareButton.disabled = false;
      if (viewCreationButton) viewCreationButton.disabled = false;
      
      // Store the original fetchable URL for downloading and saving.
      // This is more persistent than a temporary blob URL.
      currentCreation = { data: fetchUrl, type: 'video' };
  } catch (fetchError) {
      console.error('Error fetching/playing video content:', fetchError);
      throw new Error(`The generated video could not be loaded. Details: ${(fetchError as Error).message}`);
  }
}

function applyWatermark(imageUrl: string): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(imageUrl); // Return original if canvas fails
                return;
            }
            
            ctx.drawImage(img, 0, 0);

            // Style the watermark
            ctx.font = `${Math.max(12, Math.min(img.width / 20, 48))}px "Google Sans", sans-serif`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            
            // Add watermark
            ctx.fillText('Se-Mo Generation', canvas.width - 15, canvas.height - 15);

            resolve(canvas.toDataURL(userSettings.imageFormat as 'image/png' | 'image/jpeg'));
        };
        img.onerror = () => {
            resolve(imageUrl); // Return original on error
        };
        img.src = imageUrl;
    });
}

async function generateImageContent() {
    const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
    const aspectRatio = userSettings.imageAspectRatio;
    let imageUrl: string;

    if (base64data && mimeType) { // Image editing
        if (statusEl) statusEl.innerText = 'Applying your edits...';
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
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
    
    if (!userState.isPremium && userSettings.watermark) {
        imageUrl = await applyWatermark(imageUrl);
    }

    if (resultImage) {
        resultImage.src = imageUrl;
        resultImage.style.display = 'block';
    }
    if (video) video.style.display = 'none';
    if (resultsContainer) resultsContainer.style.display = 'block';
    if (saveCreationButton) saveCreationButton.disabled = false;
    if (shareButton) shareButton.disabled = false;
    if (viewCreationButton) viewCreationButton.disabled = false;
    currentCreation = { data: imageUrl, type: 'image' };
}

async function generate() {
  if (currentPromptText.trim() === '') {
    showErrorModal(['Please enter a prompt.']); return;
  }
  if (generationType === 'image') {
    const explicitWords = ['explicit', 'forbidden', 'banned', 'inappropriate'];
    if (explicitWords.some(word => currentPromptText.toLowerCase().includes(word))) {
      if (statusEl) statusEl.innerText = 'Image creation out of line.'; return;
    }
  }

  if (spinnerContainer) spinnerContainer.style.display = 'flex';
  if (statusEl) statusEl.innerText = '';
  if (resultsContainer) resultsContainer.style.display = 'none';
  if (video) video.src = '';
  if (resultImage) resultImage.src = '';
  if (saveCreationButton) saveCreationButton.disabled = true;
  if (shareButton) shareButton.disabled = true;
  if (viewCreationButton) viewCreationButton.disabled = true;

  setControlsDisabled(true);

  try {
    if (generationType === 'video') {
        const duration = parseInt(durationSlider.value, 10);
        const quality = userSettings.videoQuality;
        const aspectRatio = videoAspectRatioSelect.value;
        await generateVideoContent(currentPromptText, base64data, mimeType, duration, quality, aspectRatio);
    } else {
        await generateImageContent();
    }
  } catch (e) {
    console.error(`${generationType} generation failed:`, e);
    const type = generationType.charAt(0).toUpperCase() + generationType.slice(1);
    
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
                'The API key has reached its usage limit for video generation. Please check your Google AI Studio account for details on your quota.',
                'You may still be able to generate images.'
            ],
            'API Quota Exceeded'
        );
    } else {
        let displayMessage = rawErrorMessage;
        try {
            // Try to parse if it's a JSON string to get a cleaner message
            const parsed = JSON.parse(rawErrorMessage);
            if (parsed.error && parsed.error.message) {
                displayMessage = parsed.error.message;
            }
        } catch (parseError) {
            // Not a JSON string, use the raw message which is fine.
        }
        showErrorModal([displayMessage], `${type} Generation Failed`);
    }
    
    if (statusEl) statusEl.innerText = `Error generating ${generationType}.`;
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

function getMotionBlurLabel(value: number): string {
    if (value === 0) return 'Off';
    if (value <= 0.3) return 'Low';
    if (value <= 0.7) return 'Medium';
    return 'High';
}

function updateMotionBlurValueDisplay(value: number) {
    if (settingMotionBlurValue) {
        settingMotionBlurValue.textContent = `${getMotionBlurLabel(value)} (${value.toFixed(1)})`;
    }
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
    if (settingVideoQualitySelect) settingVideoQualitySelect.value = userSettings.videoQuality;
    if (settingMotionBlurSlider) {
        settingMotionBlurSlider.value = String(userSettings.motionBlurStrength);
        updateMotionBlurValueDisplay(userSettings.motionBlurStrength);
    }
    if (settingImageAspectRatioSelect) settingImageAspectRatioSelect.value = userSettings.imageAspectRatio;
    if (settingImageFormatSelect) settingImageFormatSelect.value = userSettings.imageFormat;
    if (settingWatermarkToggle) {
        settingWatermarkToggle.checked = userSettings.watermark;
        // Disable toggle for premium users as watermark is always off
        if(userState.isPremium && watermarkSettingContainer) {
            settingWatermarkToggle.disabled = true;
            watermarkSettingContainer.style.opacity = '0.5';
        } else if (watermarkSettingContainer) {
            settingWatermarkToggle.disabled = false;
            watermarkSettingContainer.style.opacity = '1';
        }
    }

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
    if (!file || !currentUser) return;

    const base64 = await blobToBase64(file);
    const dataUrl = `data:${file.type};base64,${base64}`;

    if (profilePicturePreview) profilePicturePreview.src = dataUrl;

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[currentUser]) {
        users[currentUser].profile.avatar = dataUrl;
        localStorage.setItem('users', JSON.stringify(users));
        if (dashboardProfilePicture) dashboardProfilePicture.src = dataUrl;
        showSettingsToast('Avatar updated!');
    }
}

function handlePasswordUpdate(e: Event) {
    e.preventDefault();
    if (!currentUser) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentUser];

    if (user && currentPasswordInput.value === user.password) {
        if (newPasswordInput.value.length < 6) {
            showErrorModal(['New password must be at least 6 characters long.']);
            return;
        }
        if (newPasswordInput.value !== confirmPasswordInput.value) {
            showErrorModal(['New passwords do not match.']);
            return;
        }
        user.password = newPasswordInput.value;
        localStorage.setItem('users', JSON.stringify(users));
        showSettingsToast('Password updated!');
        (e.target as HTMLFormElement).reset();
    } else {
        showErrorModal(['Incorrect current password.']);
    }
}

function handleLinksUpdate(e: Event) {
    e.preventDefault();
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[currentUser]) {
        users[currentUser].profile.links.facebook = facebookLinkInput.value;
        users[currentUser].profile.links.x = xLinkInput.value;
        users[currentUser].profile.links.instagram = instagramLinkInput.value;
        localStorage.setItem('users', JSON.stringify(users));
        showSettingsToast('Links updated!');
    }
}

function handleGenerationSettingsUpdate(e: Event) {
    e.preventDefault();
    userSettings.videoQuality = settingVideoQualitySelect.value;
    userSettings.motionBlurStrength = parseFloat(settingMotionBlurSlider.value);
    userSettings.imageAspectRatio = settingImageAspectRatioSelect.value;
    userSettings.imageFormat = settingImageFormatSelect.value;
    userSettings.watermark = settingWatermarkToggle.checked;
    saveUserSettings();
    applyUserSettingsToDashboard();
    showSettingsToast('Generation settings saved!');
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

function handleLanguageRegionUpdate(e: Event) {
    e.preventDefault();
    userSettings.language = settingLanguageSelect.value;
    userSettings.timezone = settingTimezoneSelect.value;
    saveUserSettings();
    showSettingsToast('Language and region saved!');
}

function handleCreatorApplication(e: Event) {
    e.preventDefault();
    if (!currentUser) return;

    const application = {
        name: creatorNameInput.value,
        link: creatorLinkInput.value,
        reason: creatorReasonInput.value,
        date: new Date().toISOString(),
    };

    const applications = JSON.parse(localStorage.getItem('creator_applications') || '{}');
    applications[currentUser] = application;
    localStorage.setItem('creator_applications', JSON.stringify(applications));

    if (creatorProgramForm) creatorProgramForm.style.display = 'none';
    if (creatorAppliedMessage) creatorAppliedMessage.style.display = 'block';
}

function handleClearCache() {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('reset_')) {
            localStorage.removeItem(key);
        }
    });
    showSettingsToast('Temporary data cleared!');
}

function handleAccountDeletion() {
    if (!currentUser || deleteConfirmInput.value !== currentUser) return;

    localStorage.removeItem(`user_${currentUser}`);
    localStorage.removeItem(`settings_${currentUser}`);
    localStorage.removeItem(`creations_${currentUser}`);
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    delete users[currentUser];
    localStorage.setItem('users', JSON.stringify(users));

    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUserName');
    window.location.href = window.location.pathname + '?message=account_deleted';
}

// --- File Handling & Creations ---
function handleMyCreationsClick() {
    if (!userState.isPremium) {
        if (subscriptionModal) subscriptionModal.style.display = 'flex';
        return;
    }
    showCreationsGallery();
}

function showCreationsGallery() {
    if (!currentUser || !creationsGallery) return;
    const creations = JSON.parse(localStorage.getItem(`creations_${currentUser}`) || '[]');
    creationsGallery.innerHTML = '';

    if (creations.length === 0) {
        creationsGallery.innerHTML = '<p>You have no saved creations yet.</p>';
    } else {
        creations.forEach((creation: any) => {
            const card = document.createElement('div');
            card.className = 'creation-card';
            card.dataset.id = String(creation.id); // Store ID on the element
            card.draggable = true; // Make it draggable
            
            let mediaEl: HTMLImageElement | HTMLVideoElement;
            if (creation.type === 'video') {
                mediaEl = document.createElement('video');
                mediaEl.muted = true; // Mute videos in gallery
                mediaEl.preload = 'metadata';
                // Asynchronously fetch and set the video source for reliable playback
                fetch(creation.data)
                    .then(res => res.blob())
                    .then(blob => {
                        if (mediaEl instanceof HTMLVideoElement) {
                           mediaEl.src = URL.createObjectURL(blob);
                        }
                    })
                    .catch(e => console.error(`Failed to load video creation ${creation.id}:`, e));
            } else {
                mediaEl = document.createElement('img');
                mediaEl.src = creation.data;
                mediaEl.alt = creation.prompt;
            }
            
            const overlay = document.createElement('div');
            overlay.className = 'creation-overlay';
            overlay.innerHTML = `
                <div class="creation-actions">
                    <button class="view-btn" title="View Full Size"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg></button>
                    <button class="rename-btn" title="Rename"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.26 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/></svg></button>
                    <button class="delete-btn" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg></button>
                </div>`;

            const infoDiv = document.createElement('div');
            infoDiv.className = 'creation-info';
            infoDiv.innerHTML = `<p class="creation-prompt">${creation.prompt || 'Untitled'}</p>`;

            overlay.querySelector('.view-btn')?.addEventListener('click', () => {
                currentCreation = creation;
                showLargeView();
            });
            overlay.querySelector('.rename-btn')?.addEventListener('click', () => renameCreation(creation.id));
            overlay.querySelector('.delete-btn')?.addEventListener('click', () => deleteCreation(creation.id));
            
            card.addEventListener('dragstart', (e) => {
                card.classList.add('dragging');
                if (e.dataTransfer) {
                    e.dataTransfer.setData('text/plain', String(creation.id));
                    e.dataTransfer.effectAllowed = 'move';
                }
            });
            
            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
            });
            
            card.appendChild(mediaEl);
            card.appendChild(overlay);
            card.appendChild(infoDiv);
            creationsGallery.appendChild(card);
        });
    }

    if (creationsModal) creationsModal.style.display = 'flex';
}

function deleteCreation(id: number) {
    if (!currentUser || !confirm('Are you sure you want to delete this creation?')) return;
    let creations = JSON.parse(localStorage.getItem(`creations_${currentUser}`) || '[]');
    creations = creations.filter((c: any) => c.id !== id);
    localStorage.setItem(`creations_${currentUser}`, JSON.stringify(creations));
    showCreationsGallery(); // Refresh the view
}

function renameCreation(id: number) {
    if (!currentUser) return;
    let creations = JSON.parse(localStorage.getItem(`creations_${currentUser}`) || '[]');
    const creationIndex = creations.findIndex((c: any) => c.id === id);
    if (creationIndex === -1) return;

    const currentPrompt = creations[creationIndex].prompt;
    const newPrompt = window.prompt(`Enter a new name or prompt for this creation:`, currentPrompt);
    
    if (newPrompt && newPrompt.trim() !== '') {
        creations[creationIndex].prompt = newPrompt.trim();
        localStorage.setItem(`creations_${currentUser}`, JSON.stringify(creations));
        showCreationsGallery(); // Refresh view
    }
}

function handleDownload() {
    if (!userState.isPremium && userState.downloadsToday >= MAX_FREE_DOWNLOADS) {
        if (subscriptionModal) subscriptionModal.style.display = 'flex';
        return;
    }
    
    const url = currentCreation.data;
    if (!url) { console.error('Download source not available'); return; }

    let filename: string;
    if (currentCreation.type === 'video') {
        filename = 'video.mp4';
    } else {
        const extension = userSettings.imageFormat === 'image/png' ? 'png' : 'jpeg';
        filename = `image.${extension}`;
    }

    if (!userState.isPremium) {
        userState.downloadsToday++;
        saveUserState();
        updateUserStatusUI();
    }
    downloadFile(url, filename);
}

function downloadFile(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function saveCreation() {
    if (!userState.isPremium) {
        if (subscriptionModal) subscriptionModal.style.display = 'flex';
        return;
    }
    if (!currentUser || !currentCreation.data) return;

    const creations = JSON.parse(localStorage.getItem(`creations_${currentUser}`) || '[]');
    creations.unshift({ // Add to the beginning
        id: Date.now(),
        type: currentCreation.type,
        data: currentCreation.data,
        prompt: currentPromptText,
    });
    localStorage.setItem(`creations_${currentUser}`, JSON.stringify(creations));
    if (saveCreationButton) saveCreationButton.textContent = 'Saved!';
    setTimeout(() => { 
        if (saveCreationButton) saveCreationButton.textContent = 'Save Creation'; 
    }, 2000);
}

function showShareFallbackModal() {
    if (shareFallbackModal) shareFallbackModal.style.display = 'flex';
}

async function handleShare() {
    if (!navigator.share) {
        showShareFallbackModal();
        return;
    }

    try {
        // Convert data URL or object URL to blob/file
        const response = await fetch(currentCreation.data);
        const blob = await response.blob();
        const extension = currentCreation.type === 'video' ? 'mp4' : (userSettings.imageFormat.split('/')[1] || 'jpeg');
        const mimeType = currentCreation.type === 'video' ? 'video/mp4' : userSettings.imageFormat;
        const file = new File([blob], `creation.${extension}`, { type: mimeType });
        
        // Use Web Share API
        await navigator.share({
            title: 'AI Creation by Se-Mo',
            text: `Check out this ${currentCreation.type} I made!\n\nPrompt: ${currentPromptText}`,
            files: [file],
        });

        // If share is successful (doesn't throw), award credit to free user
        if (!userState.isPremium) {
            const today = new Date().toISOString().split('T')[0];
            if (userState.lastShareDate !== today) {
                userState.sharesToday = 0;
                userState.lastShareDate = today;
            }

            if (userState.sharesToday < MAX_SHARE_CREDITS) {
                userState.sharesToday++;
                
                // Give them back one download credit if they have used any.
                if (userState.downloadsToday > 0) {
                    userState.downloadsToday--; 
                }
                
                saveUserState();
                updateUserStatusUI();
                showSettingsToast(`Thanks for sharing! You've earned a download credit.`);
            } else {
                showSettingsToast('You have earned all your share credits for today!');
            }
        }
    } catch (error) {
        // AbortError is expected if the user closes the share dialog, so we ignore it.
        if ((error as DOMException).name !== 'AbortError') {
            console.error('Error sharing:', error);
            showErrorModal(['Please try again or download the file to share it manually.'], 'Sharing failed.');
        }
    }
}

// --- Utility & UI Helpers ---
function showErrorModal(messages: string[], title?: string) {
  const titleEl = errorModal?.querySelector('h3');
  if (!titleEl || !errorMessageContainer) return;

  titleEl.textContent = title || 'Error';
  errorMessageContainer.innerHTML = messages.map(msg => `<p>${msg}</p>`).join('');
  
  if (errorModal) errorModal.style.display = 'flex';
}

function showSettingsToast(message: string) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'var(--secondary-color)';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '1002';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 100);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.addEventListener('transitionend', () => toast.remove());
    }, 2500);
}

function hideLargeView() {
    if (largeViewModal) largeViewModal.style.display = 'none';
    if (largeViewImage) largeViewImage.src = '';
    if (largeViewVideo) {
        largeViewVideo.pause();
        largeViewVideo.src = '';
    }
}

function setControlsDisabled(disabled: boolean) {
    const isVideoUploaded = videoPreview && videoPreview.style.display === 'block';
    if (generateButton) generateButton.disabled = disabled || currentPromptText.trim() === '' || isVideoUploaded;
    if (aiAssistButton) aiAssistButton.disabled = disabled || currentPromptText.trim() === '';
    if (upload) upload.disabled = disabled;
    if (promptEl) promptEl.disabled = disabled;
    if (durationSlider) durationSlider.disabled = disabled;
    if (qualitySelect) qualitySelect.disabled = disabled;
    if (videoAspectRatioSelect) videoAspectRatioSelect.disabled = disabled;
    if (imageAspectRatioSelect) imageAspectRatioSelect.disabled = disabled;
    if (imageFormatSelect) imageFormatSelect.disabled = disabled;
    generationTypeRadios.forEach(radio => radio.disabled = disabled);
}

function showLargeView() {
    if (!currentCreation.data || !largeViewModal) return;

    if (currentCreation.type === 'image') {
        if (largeViewImage) {
            largeViewImage.src = currentCreation.data;
            largeViewImage.style.display = 'block';
        }
        if (largeViewVideo) {
            largeViewVideo.src = '';
            largeViewVideo.style.display = 'none';
        }
    } else { // video
        if (largeViewVideo) {
            largeViewVideo.src = ''; // Clear previous source before fetching
            largeViewVideo.style.display = 'block';
        }
        if (largeViewImage) {
            largeViewImage.style.display = 'none';
        }
        
        // Asynchronously fetch and set the video source for reliable playback
        fetch(currentCreation.data)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.blob();
            })
            .then(blob => {
                if (largeViewVideo) {
                    largeViewVideo.src = URL.createObjectURL(blob);
                }
            })
            .catch(e => {
                console.error("Could not load large view video:", e);
                showErrorModal(["Failed to load video for viewing. Please try downloading it instead."], "Playback Error");
            });
    }
    largeViewModal.style.display = 'flex';
}

function renderPrompts(prompts: string[]) {
    if (!dailyPromptsGallery) return;
    dailyPromptsGallery.innerHTML = ''; // Clear existing
    
    prompts.forEach(promptText => {
        const card = document.createElement('button');
        card.className = 'prompt-card';
        card.textContent = promptText;
        
        card.addEventListener('click', () => {
            if (promptEl) {
                promptEl.value = promptText;
                promptEl.dispatchEvent(new Event('input', { bubbles: true }));
                promptEl.focus();
                showSettingsToast('Prompt copied!');
            }
        });
        
        dailyPromptsGallery.appendChild(card);
    });
}

function fetchNewDailyPrompts() {
    // Shuffle the array and pick the first few
    const shuffled = [...ALL_PROMPTS].sort(() => 0.5 - Math.random());
    const newPrompts = shuffled.slice(0, DAILY_PROMPTS_COUNT);
    
    const today = new Date().toISOString().split('T')[0];
    
    // Save to localStorage
    localStorage.setItem('daily_prompts', JSON.stringify(newPrompts));
    localStorage.setItem('last_prompts_date', today);
    
    renderPrompts(newPrompts);
}

function populateDailyPrompts() {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem('last_prompts_date');
    const storedPromptsJSON = localStorage.getItem('daily_prompts');

    if (lastDate === today && storedPromptsJSON) {
        try {
            const storedPrompts = JSON.parse(storedPromptsJSON);
            if (Array.isArray(storedPrompts) && storedPrompts.length > 0) {
                renderPrompts(storedPrompts);
                return;
            }
        } catch (e) {
            console.error("Failed to parse stored prompts:", e);
        }
    }
    
    // If it's a new day or data is invalid/missing, fetch new prompts
    fetchNewDailyPrompts();
}

function getDragAfterElement(container: HTMLElement, y: number) {
    const draggableElements = [...container.querySelectorAll('.creation-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child as HTMLElement };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY, element: null as (HTMLElement | null) }).element;
}


// --- Subscription & Payment Logic ---
function toggleAddCardView(showForm: boolean) {
    if (showForm) {
        paymentMethodsView.style.display = 'none';
        addCardForm.style.display = 'block';
        addCardForm.reset();
    } else {
        paymentMethodsView.style.display = 'block';
        addCardForm.style.display = 'none';
    }
}

function formatCardNumber(e: Event) {
    const input = e.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = value;
}

function formatExpiry(e: Event) {
    const input = e.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

function renderSubscriptionStatus() {
    if (!currentUser) return;
    if (userState.isPremium) {
        subscriptionStatusContainer.innerHTML = `
            <h4>Current Plan: Premium ${userState.subscription.plan.charAt(0).toUpperCase() + userState.subscription.plan.slice(1)}</h4>
            <p>Your subscription is active. Next billing date: ${userState.subscription.nextBilling}</p>
        `;
        paymentMethodsView.style.display = 'block';
    } else {
        subscriptionStatusContainer.innerHTML = `
            <h4>You are on the Free Plan</h4>
            <p>Upgrade to Premium to manage payment methods and unlock all features.</p>
            <button id="upgrade-from-settings-button" class="settings-save-button premium" style="margin-top: 1rem;">Upgrade to Premium</button>
        `;
        paymentMethodsView.style.display = 'none';
        // Add event listener for the newly created button
        document.getElementById('upgrade-from-settings-button')?.addEventListener('click', () => {
            if (settingsModal) settingsModal.style.display = 'none';
            if (subscriptionModal) subscriptionModal.style.display = 'flex';
        });
    }
}

function renderSavedCards() {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const cards = users[currentUser]?.paymentMethods || [];

    savedCardsList.innerHTML = ''; // Clear existing list
    if (cards.length === 0) {
        savedCardsList.innerHTML = '<p>You have no saved payment methods.</p>';
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
        const isDefaultBadge = card.isDefault ? '<span class="default-badge">Default</span>' : '';
        cardEl.innerHTML = `
            <img src="${logoUrl}" class="card-icon" alt="${card.type}">
            <div class="card-info">
                <div class="card-info-main">
                  <span>${card.type} ending in ${card.maskedNumber}</span>
                  ${isDefaultBadge}
                </div>
                <div class="card-info-sub">Cardholder: ${card.holderName}</div>
            </div>
            <div class="card-actions">
                <button class="set-default-btn" title="Set as Default" ${card.isDefault ? 'style="display:none;"' : ''}>
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </button>
                <button class="delete-card-btn" title="Delete Card">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
                </button>
            </div>
        `;
        cardEl.querySelector('.set-default-btn')?.addEventListener('click', () => handleSetDefaultCard(card.id));
        cardEl.querySelector('.delete-card-btn')?.addEventListener('click', () => handleDeleteCard(card.id));
        savedCardsList.appendChild(cardEl);
    });
}

function handleSaveCard(e: Event) {
    e.preventDefault();
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[currentUser]) return;

    const cardNumber = cardNumberInput.value.replace(/\s/g, '');
    const newCard = {
        id: Date.now(),
        type: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
        maskedNumber: cardNumber.slice(-4),
        holderName: cardHolderInput.value,
        isDefault: setCardDefaultCheckbox.checked,
    };

    let cards = users[currentUser].paymentMethods || [];
    if (newCard.isDefault) {
        cards.forEach((c: any) => c.isDefault = false);
    }
    cards.push(newCard);

    users[currentUser].paymentMethods = cards;
    localStorage.setItem('users', JSON.stringify(users));

    renderSavedCards();
    toggleAddCardView(false);
    showSettingsToast('Payment method saved!');
}

function handleSetDefaultCard(cardId: number) {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[currentUser]?.paymentMethods) return;

    users[currentUser].paymentMethods.forEach((card: any) => {
        card.isDefault = card.id === cardId;
    });

    localStorage.setItem('users', JSON.stringify(users));
    renderSavedCards();
}

function handleDeleteCard(cardId: number) {
    if (!currentUser || !confirm('Are you sure you want to delete this payment method?')) return;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[currentUser]?.paymentMethods) return;

    users[currentUser].paymentMethods = users[currentUser].paymentMethods.filter((card: any) => card.id !== cardId);

    // If the deleted card was the default, make another one default if possible
    if (users[currentUser].paymentMethods.length > 0 && !users[currentUser].paymentMethods.some((c: any) => c.isDefault)) {
        users[currentUser].paymentMethods[0].isDefault = true;
    }

    localStorage.setItem('users', JSON.stringify(users));
    renderSavedCards();
}

// --- Custom Video Player ---
function setupCustomVideoPlayer() {
    if (!video || !videoPlayerContainer) return;

    // --- Helper Functions ---
    function formatTime(timeInSeconds: number) {
        const result = new Date(timeInSeconds * 1000).toISOString().substring(14, 5);
        return result;
    }

    function togglePlay() {
        video.paused ? video.play() : video.pause();
    }

    function updatePlayButton() {
        if (video.paused) {
            playBtnIcon.style.display = 'block';
            pauseBtnIcon.style.display = 'none';
            videoPlayerContainer.classList.add('paused');
        } else {
            playBtnIcon.style.display = 'none';
            pauseBtnIcon.style.display = 'block';
            videoPlayerContainer.classList.remove('paused');
        }
    }

    function toggleMute() {
        video.muted = !video.muted;
    }

    function updateVolume() {
        if (video.muted || video.volume === 0) {
            volumeSlider.value = '0';
            volumeHighIcon.style.display = 'none';
            volumeMutedIcon.style.display = 'block';
        } else {
            volumeSlider.value = String(video.volume);
            volumeHighIcon.style.display = 'block';
            volumeMutedIcon.style.display = 'none';
        }
        volumeSlider.style.background = `linear-gradient(to right, white ${Number(volumeSlider.value) * 100}%, rgba(255, 255, 255, 0.3) ${Number(volumeSlider.value) * 100}%)`;
    }

    function changePlaybackSpeed(speed: number) {
        video.playbackRate = speed;
        speedBtn.textContent = `${speed}x`;
        // Update active class on speed options
        speedOptionsContainer.querySelectorAll('button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.speed === String(speed));
        });
    }

    function toggleFullScreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            videoPlayerContainer.requestFullscreen();
        }
    }

    function updateFullscreenButton() {
        if (document.fullscreenElement) {
            fullscreenOpenIcon.style.display = 'none';
            fullscreenCloseIcon.style.display = 'block';
        } else {
            fullscreenOpenIcon.style.display = 'block';
            fullscreenCloseIcon.style.display = 'none';
        }
    }


    // --- Event Listeners ---
    video.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(video.duration);
        progressBar.max = String(video.duration);
    });
    
    video.addEventListener('timeupdate', () => {
        currentTimeEl.textContent = formatTime(video.currentTime);
        progressBar.value = String(video.currentTime);
        const percentage = (video.currentTime / video.duration) * 100;
        progressBar.style.background = `linear-gradient(to right, var(--primary-color) ${percentage}%, rgba(255, 255, 255, 0.3) ${percentage}%)`;
    });
    
    video.addEventListener('play', updatePlayButton);
    video.addEventListener('pause', updatePlayButton);
    
    video.addEventListener('volumechange', updateVolume);

    playPauseBtn.addEventListener('click', togglePlay);
    progressBar.addEventListener('input', (e) => {
        video.currentTime = Number((e.target as HTMLInputElement).value);
    });

    volumeBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', (e) => {
        const volume = Number((e.target as HTMLInputElement).value);
        video.muted = volume === 0;
        video.volume = volume;
    });

    speedOptionsContainer.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            changePlaybackSpeed(Number(btn.dataset.speed));
        });
    });

    fullscreenBtn.addEventListener('click', toggleFullScreen);
    document.addEventListener('fullscreenchange', updateFullscreenButton);
    
    // Initialize
    updatePlayButton();
    updateVolume();
}

// --- Event Listeners & Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    cacheDOMElements();

    // --- Configuration Check ---
    if (!GEMINI_API_KEY) {
        console.error('Gemini API key is not configured.');
        const configErrorModal = document.querySelector('#config-error-overlay');
        
        // Hide splash screen immediately to show the error
        if (splashScreen) {
            splashScreen.style.display = 'none';
        }
        
        if (configErrorModal) {
            (configErrorModal as HTMLElement).style.display = 'flex';
        }
        // Stop further execution
        return;
    }

    // --- Splash Screen Logic ---
    setTimeout(() => {
        if (splashScreen) {
            splashScreen.classList.add('hidden');
            splashScreen.addEventListener('transitionend', () => {
                if(splashScreen) splashScreen.style.display = 'none';
            });
        }
    }, 1500); // Simulate loading time
    
    // --- Drag and Drop Listeners ---
    if (mainContent && upload) {
        let dragCounter = 0;

        mainContent.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter++;
            if (dragCounter === 1) { // Only add class on first enter
                mainContent.classList.add('drag-over');
            }
        });

        mainContent.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation(); // This is crucial to allow dropping
        });

        mainContent.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter--;
            if (dragCounter === 0) { // Only remove class on final leave
               mainContent.classList.remove('drag-over');
            }
        });

        mainContent.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter = 0; // Reset counter
            mainContent.classList.remove('drag-over');

            const files = e.dataTransfer?.files;
            if (files && files.length > 0) {
                // Assign the dropped files to the file input and dispatch a 'change' event
                // to trigger the existing handleFileUpload logic.
                upload.files = files;
                upload.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                console.warn('No files were dropped.');
            }
        });
    }

    // --- Auth Listeners ---
    if(loginForm) loginForm.addEventListener('submit', handleLogin);
    if(registerForm) registerForm.addEventListener('submit', handleRegister);
    if(forgotPasswordForm) forgotPasswordForm.addEventListener('submit', handleForgotPasswordRequest);
    if(resetPasswordForm) resetPasswordForm.addEventListener('submit', handlePasswordReset);
    if(authToggleLink) authToggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mode = (e.target as HTMLElement).dataset.mode as 'login' | 'register' | 'forgot';
        switchAuthView(mode);
    });
    if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthView('forgot');
    });
    setupAuthLegalTabs();
    
    // --- Main UI Listeners ---
    if (generateButton) generateButton.addEventListener('click', generate);
    if (aiAssistButton) aiAssistButton.addEventListener('click', handleAiAssist);
    if (promptEl) {
        promptEl.addEventListener('input', () => {
            currentPromptText = promptEl.value;
            const isVideoUploaded = videoPreview && videoPreview.style.display === 'block';
            if(generateButton) generateButton.disabled = currentPromptText.trim() === '' || isVideoUploaded;
            if(aiAssistButton) aiAssistButton.disabled = currentPromptText.trim() === '';
        });
    }

    if(durationSlider && durationValue) {
        durationSlider.addEventListener('input', (e) => {
            durationValue.textContent = `${(e.target as HTMLInputElement).value}s`;
        });
    }

    if(qualitySelect) {
        qualitySelect.addEventListener('change', (e) => {
            userSettings.videoQuality = (e.target as HTMLSelectElement).value;
        });
    }
    
    if (imageAspectRatioSelect) {
        imageAspectRatioSelect.addEventListener('change', (e) => {
            userSettings.imageAspectRatio = (e.target as HTMLSelectElement).value;
        });
    }

    if (imageFormatSelect) {
        imageFormatSelect.addEventListener('change', (e) => {
            userSettings.imageFormat = (e.target as HTMLSelectElement).value;
        });
    }

    if(examplePromptsSelect && promptEl) {
        examplePromptsSelect.addEventListener('change', (e) => {
            const selectedPrompt = (e.target as HTMLSelectElement).value;
            if (selectedPrompt) {
                promptEl.value = selectedPrompt;
                promptEl.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }
    
    if (upload) upload.addEventListener('change', handleFileUpload);
    if (clearPreviewButton) clearPreviewButton.addEventListener('click', clearPreview);
    
    generationTypeRadios.forEach(radio => {
        radio.addEventListener('change', handleGenerationTypeChange);
    });

    if (downloadButton) downloadButton.addEventListener('click', handleDownload);
    if (saveCreationButton) saveCreationButton.addEventListener('click', saveCreation);
    if (viewCreationButton) viewCreationButton.addEventListener('click', showLargeView);
    if (shareButton) shareButton.addEventListener('click', handleShare);
    if (largeViewCloseButton) largeViewCloseButton.addEventListener('click', hideLargeView);

    // Profile Dropdown
    if (profileButton) {
        profileButton.addEventListener('click', () => {
            if (profileDropdown) {
                profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
            }
        });
    }
    
    // Close dropdown if clicking outside
    document.addEventListener('click', (event) => {
        if (profileContainer && !profileContainer.contains(event.target as Node) && profileDropdown) {
            profileDropdown.style.display = 'none';
        }
    });
    
    if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    if (settingsButton) {
        settingsButton.addEventListener('click', (e) => {
            e.preventDefault();
            openSettingsModal();
        });
    }
    if (myCreationsButton) {
        myCreationsButton.addEventListener('click', (e) => {
            e.preventDefault();
            handleMyCreationsClick();
        });
    }

    // Modal Close Buttons
    if (modalCloseButton) modalCloseButton.addEventListener('click', () => {
        if (errorModal) errorModal.style.display = 'none';
    });
    if (subscriptionModalCloseButton) subscriptionModalCloseButton.addEventListener('click', () => {
        if (subscriptionModal) subscriptionModal.style.display = 'none';
    });
    if(settingsModalCloseButton) settingsModalCloseButton.addEventListener('click', () => {
        if (settingsModal) settingsModal.style.display = 'none';
    });
    if (creationsModalCloseButton) creationsModalCloseButton.addEventListener('click', () => {
        if(creationsModal) creationsModal.style.display = 'none';
    });
    if (shareFallbackCloseButton) shareFallbackCloseButton.addEventListener('click', () => {
        if (shareFallbackModal) shareFallbackModal.style.display = 'none';
    });
    
    // Daily Prompts
    if (refreshPromptsButton) {
        refreshPromptsButton.addEventListener('click', fetchNewDailyPrompts);
    }
    
    // Subscription Modal Logic
    if (subscribeButton) subscribeButton.addEventListener('click', () => {
        if (subscriptionModal) subscriptionModal.style.display = 'flex';
    });
    if(userStatusEl) userStatusEl.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).classList.contains('upgrade-cta')) {
             if (subscriptionModal) subscriptionModal.style.display = 'flex';
        }
    });
    pricingPlans.forEach(plan => {
        plan.addEventListener('click', () => handlePlanSelection(plan as HTMLDivElement));
    });
    if (continuePaymentButton) continuePaymentButton.addEventListener('click', showPaymentSelectionView);
    if (backToPlansButton) backToPlansButton.addEventListener('click', () => {
        if (planSelectionView) planSelectionView.style.display = 'block';
        if (paymentSelectionView) paymentSelectionView.style.display = 'none';
    });
    if (confirmPaymentButton) confirmPaymentButton.addEventListener('click', handleConfirmPayment);
    if (modalAddCardButton) modalAddCardButton.addEventListener('click', () => {
        if (modalAddCardForm) modalAddCardForm.style.display = 'block';
        if (modalAddCardButton) modalAddCardButton.style.display = 'none';
    });
    if (modalCancelAddCardButton) modalCancelAddCardButton.addEventListener('click', () => {
        if (modalAddCardForm) modalAddCardForm.style.display = 'none';
        if (modalAddCardButton) modalAddCardButton.style.display = 'block';
    });
    if(modalAddCardForm) modalAddCardForm.addEventListener('submit', handleSaveCardInModal);
    if(modalCardNumberInput) modalCardNumberInput.addEventListener('input', formatCardNumber);
    if(modalCardExpiryInput) modalCardExpiryInput.addEventListener('input', formatExpiry);

    // Settings Modal Logic
    setupSettingsNavigation();
    if (profileForm) profileForm.addEventListener('submit', handleProfileUpdate);
    if (profilePictureInput) profilePictureInput.addEventListener('change', handleAvatarChange);
    if (passwordForm) passwordForm.addEventListener('submit', handlePasswordUpdate);
    if (linksForm) linksForm.addEventListener('submit', handleLinksUpdate);
    if (generationSettingsForm) generationSettingsForm.addEventListener('submit', handleGenerationSettingsUpdate);
    if (settingMotionBlurSlider) settingMotionBlurSlider.addEventListener('input', (e) => updateMotionBlurValueDisplay(parseFloat((e.target as HTMLInputElement).value)));
    if (notificationsForm) notificationsForm.addEventListener('submit', handleNotificationsUpdate);
    if (settingDarkModeToggle) settingDarkModeToggle.addEventListener('change', (e) => {
        userSettings.theme = (e.target as HTMLInputElement).checked ? 'dark' : 'light';
        saveUserSettings();
        applyTheme();
    });
    if (languageRegionForm) languageRegionForm.addEventListener('submit', handleLanguageRegionUpdate);
    if (creatorProgramForm) creatorProgramForm.addEventListener('submit', handleCreatorApplication);
    
    // Privacy & Data
    if (manageProjectsButton) manageProjectsButton.addEventListener('click', handleMyCreationsClick);
    if (clearCacheButton) clearCacheButton.addEventListener('click', handleClearCache);
    if (deleteAccountButton) deleteAccountButton.addEventListener('click', () => {
        if (deleteAccountModal) deleteAccountModal.style.display = 'flex';
    });
    if (cancelDeleteButton) cancelDeleteButton.addEventListener('click', () => {
        if (deleteAccountModal) deleteAccountModal.style.display = 'none';
        if(deleteConfirmInput) deleteConfirmInput.value = '';
    });
    if (deleteConfirmInput && confirmDeleteButton) {
        deleteConfirmInput.addEventListener('input', () => {
            confirmDeleteButton.disabled = deleteConfirmInput.value !== currentUser;
        });
    }
    if (confirmDeleteButton) confirmDeleteButton.addEventListener('click', handleAccountDeletion);


    // Payments Settings
    if (addNewCardButton) addNewCardButton.addEventListener('click', () => toggleAddCardView(true));
    if (cancelAddCardButton) cancelAddCardButton.addEventListener('click', () => toggleAddCardView(false));
    if (addCardForm) addCardForm.addEventListener('submit', handleSaveCard);
    if(cardNumberInput) cardNumberInput.addEventListener('input', formatCardNumber);
    if(cardExpiryInput) cardExpiryInput.addEventListener('input', formatExpiry);
    
    // Creations Gallery Drag & Drop
    if (creationsGallery) {
        creationsGallery.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(creationsGallery, e.clientY);
            const dragging = document.querySelector('.dragging');
            if (dragging) {
                if (afterElement == null) {
                    creationsGallery.appendChild(dragging);
                } else {
                    creationsGallery.insertBefore(dragging, afterElement);
                }
            }
        });
    }

    // --- Final Setup ---
    checkAuthStatus();
    setupCustomVideoPlayer();
});