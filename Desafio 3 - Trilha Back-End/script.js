const container = document.getElementById('container');
const welcomeScreen = document.getElementById('welcome-screen');
const welcomeUsername = document.getElementById('welcome-username');

const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const logoutBtn = document.getElementById('logout');

const signupStep1 = document.getElementById('signup-step1');
const signupStep2 = document.getElementById('signup-step2');
const signupStep3 = document.getElementById('signup-step3');
const signupStep4 = document.getElementById('signup-step4');

const nextToStep2Btn = document.getElementById('next-to-step2');
const prevToStep1Btn = document.getElementById('prev-to-step1');
const nextToStep3Btn = document.getElementById('next-to-step3');
const prevToStep2Btn = document.getElementById('prev-to-step2');
const nextToStep4Btn = document.getElementById('next-to-step4');
const prevToStep3Btn = document.getElementById('prev-to-step3');
const backToStep1Btn = document.getElementById('back-to-step1');
const backToStep2Btn = document.getElementById('back-to-step2');
const backToStep3Btn = document.getElementById('back-to-step3');
const finalizarCadastroBtn = document.getElementById('finalizar-cadastro');

const idadeInput = document.querySelector('input[placeholder="Idade"]');
const cpfInput = document.querySelector('#signup-step2 input[placeholder="CPF"]');
const telInput = document.querySelector('#signup-step2 input[type="tel"]');
const cepInput = document.getElementById('cep');
const termsInput = document.getElementById('terms');

function validateUsername(username) {
    const re = /^[a-zA-Z0-9]+$/;
    return re.test(username);
}

function validateFullName(name) {
    const re = /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ'\s]+$/;
    return re.test(name);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    return password.length >= 8;
}

function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    return cpf.length === 11;
}

function validateTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');
    return telefone.length >= 10 && telefone.length <= 11;
}

function validateTrilha() {
    return document.querySelector('input[name="trilha"]:checked') !== null;
}

function saveFormData() {
    const formData = {
        step1: getFormData('#signup-step1'),
        step2: getFormData('#signup-step2'),
        step3: getFormData('#signup-step3'),
        step4: getFormData('#signup-step4')
    };
    localStorage.setItem('tempFormData', JSON.stringify(formData));
}

function getFormData(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return {};
    
    const data = {};
    const inputs = form.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        if (input.type === 'file') {
            if (input.files.length > 0) {
                data[input.name] = true;
            }
            return;
        }
        
        if (input.type === 'radio' || input.type === 'checkbox') {
            if (input.checked) {
                data[input.name] = input.value;
            }
            return;
        }
        
        data[input.name || input.id] = input.value;
    });
    
    return data;
}

function loadFormData() {
    const savedData = localStorage.getItem('tempFormData');
    if (!savedData) return;
    
    const formData = JSON.parse(savedData);
    
    setFormData('#signup-step1', formData.step1);
    setFormData('#signup-step2', formData.step2);
    setFormData('#signup-step3', formData.step3);
    setFormData('#signup-step4', formData.step4);
    
    if (formData.step2.identidade) {
        document.querySelector('.upload-label p').textContent = 'Documento carregado (prévia não disponível)';
    }
}

function setFormData(formSelector, data) {
    const form = document.querySelector(formSelector);
    if (!form || !data) return;
    
    Object.keys(data).forEach(key => {
        const input = form.querySelector(`[name="${key}"], #${key}`);
        if (!input) return;
        
        if (input.type === 'radio' || input.type === 'checkbox') {
            input.checked = (input.value === data[key]);
            return;
        }
        
        input.value = data[key];
        
        if (['cpf', 'cep', 'tel'].includes(key)) {
            input.dispatchEvent(new Event('input'));
        }
    });
}

function clearSavedFormData() {
    localStorage.removeItem('tempFormData');
}

function showError(input, message) {
    let errorSpan = input.nextElementSibling;
    
    if (!errorSpan || !errorSpan.classList.contains('error-message')) {
        errorSpan = input.closest('.form-group')?.querySelector('.error-message');
    }

    if (!errorSpan) {
        errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        input.parentNode.appendChild(errorSpan);
    }

    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
    input.style.border = '1px solid #ff3860';
}

function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
}

function clearError(input) {
    const errorSpan = input.nextElementSibling?.classList.contains('error-message') 
        ? input.nextElementSibling 
        : input.closest('.form-group')?.querySelector('.error-message');
    
    if (errorSpan) {
        errorSpan.style.display = 'none';
    }
    
    input.style.border = '';
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    clearAllErrors();

    inputs.forEach(input => {
        if (input.placeholder === 'Nome de usuário') {
            if (!validateUsername(input.value.trim())) {
                showError(input, 'Apenas letras e números são permitidos');
                isValid = false;
                return;
            }
        }

        if (input.placeholder === 'Nome Completo') {
            if (!validateFullName(input.value.trim())) {
                showError(input, 'Apenas letras são permitidas');
                isValid = false;
                return;
            }
        }

        const idadeField = form.querySelector('input[placeholder="Idade"]');
        if (idadeField) {
            const idade = parseInt(idadeField.value) || 0;
            if (isNaN(idade)) {
                showError(idadeField, 'Idade deve ser um número');
                isValid = false;
            } else if (idade < 16) {
                showError(idadeField, 'Idade mínima: 16 anos');
                isValid = false;
            } else if (idade > 120) {
                showError(idadeField, 'Idade máxima: 120 anos');
                isValid = false;
            }
        }

        if (input.type === 'email') {
            if (!validateEmail(input.value.trim())) {
                showError(input, 'Por favor, insira um email válido');
                isValid = false;
                return;
            }
        }

        if (input.type === 'password') {
            if (!validatePassword(input.value)) {
                showError(input, 'A senha deve ter no mínimo 8 caracteres');
                isValid = false;
                return;
            }
        }

        if (input.placeholder === 'CPF') {
            if (!validateCPF(input.value)) {
                showError(input, 'CPF deve conter 11 dígitos');
                isValid = false;
                return;
            }
        }

        if (input.type === 'tel') {
            if (!validateTelefone(input.value)) {
                showError(input, 'Telefone inválido');
                isValid = false;
                return;
            }
        }

        if (input.type === 'radio' && input.required) {
            if (!validateTrilha()) {
                document.getElementById('trilha-error').style.display = 'block';
                isValid = false;
                return;
            }
        }

        if (input.type === 'checkbox' && input.required) {
            if (!input.checked) {
                document.getElementById('terms-error').style.display = 'block';
                isValid = false;
                return;
            }
        }

        if (!input.value.trim() && input.type !== 'checkbox' && input.type !== 'radio') {
            showError(input, 'Este campo é obrigatório');
            isValid = false;
            return;
        }
    });
    
    return isValid;
}

function resetForms() {
    document.querySelectorAll('.signup-form').forEach(form => form.reset());
    
    const fileInput = document.getElementById('identidade');
    if (fileInput) {
        fileInput.value = '';
        const preview = document.querySelector('.preview-image');
        if (preview) {
            preview.remove();
        }
        const uploadText = document.querySelector('.upload-label p');
        if (uploadText) {
            uploadText.textContent = 'Clique aqui para selecionar o arquivo';
        }
        const uploadContainer = document.querySelector('.upload-container');
        uploadContainer.style.borderColor = '#ccc';
    }

    signupStep1.style.display = 'flex';
    signupStep2.style.display = 'none';
    signupStep3.style.display = 'none';
    signupStep4.style.display = 'none';
    container.classList.remove("active", "active-step2", "active-step3", "active-step4");
    
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
    
    document.querySelectorAll('input, select').forEach(input => {
        input.style.border = '';
    });
    clearSavedFormData();
}

function adjustScrollHeight() {
    const formContainers = document.querySelectorAll('.signup-form');
    formContainers.forEach(form => {
        const scrollContent = form.querySelector('.form-scroll-content');
        if (scrollContent) {
            const formHeight = form.clientHeight;
            const buttonsHeight = form.querySelector('.form-buttons')?.clientHeight || 0;
            const headers = form.querySelector('h1');
            const span = form.querySelector('span');
            const headersHeight = (headers?.clientHeight || 0) + 
                                 (span?.clientHeight || 0) + 30;
            scrollContent.style.maxHeight = `${formHeight - buttonsHeight - headersHeight}px`;
        }
    });
}

function handleLogin() {
    const loginForm = document.querySelector('.sign-in form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = this.querySelector('input[type="text"]').value.trim();
            const password = this.querySelector('input[type="password"]').value.trim();

            const userData = JSON.parse(localStorage.getItem('registeredUsers')) || [];
            
            const user = userData.find(u => u.username === username && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', username);
                
                welcomeUsername.textContent = username;
                welcomeScreen.style.display = 'flex';
                
                const toggleButtons = document.querySelector('.toggle-container');
                const signInForm = document.querySelector('.form-container.sign-in');
                const signUpForm = document.querySelector('.form-container.sign-up');
                if (signInForm, signUpForm, toggleButtons) {
                    signInForm.style.display = 'none';
                    signUpForm.style.display = 'none';
                    toggleButtons.style.display = 'none'; 
                }
            } else {
                const oldError = this.querySelector('.login-error');
                if (oldError) oldError.remove();
                
                const errorMsg = document.createElement('p');
                errorMsg.className = 'login-error';
                errorMsg.style.color = '#ff3860';
                errorMsg.style.marginTop = '10px';
                errorMsg.textContent = 'Usuário ou senha incorretos';
                
                this.querySelector('button').after(errorMsg);
            }
        });
    }
}

function handleLogout() {
    logoutBtn.addEventListener('click', function() {
        welcomeScreen.style.display = 'none';
        
        const toggleButtons = document.querySelector('.toggle-container');
        const signInForm = document.querySelector('.form-container.sign-in');
        const signUpForm = document.querySelector('.form-container.sign-up');
        if (signInForm, signUpForm, toggleButtons) {
            signInForm.style.display = 'flex';
            signUpForm.style.display = 'flex';
            toggleButtons.style.display = 'block';
        }
    });
}

function showFeedbackModal() {
    const modal = document.getElementById('feedback-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeFeedbackModal() {
    const modal = document.getElementById('feedback-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function setupFeedbackForm() {
    document.getElementById('feedback-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        const comment = document.getElementById('feedback-comment').value;
        
        console.log('Feedback enviado:', { rating, comment });
        
        try {
            const feedbacks = JSON.parse(localStorage.getItem('formFeedbacks') || '[]');
            feedbacks.push({ rating, comment, date: new Date().toISOString() });
            localStorage.setItem('formFeedbacks', JSON.stringify(feedbacks));
        } catch (error) {
            console.error('Erro ao salvar feedback:', error);
        }
        
        closeFeedbackModal();
    });
}

function setupIdadeInput() {
    if (idadeInput) {
        idadeInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
            if (this.value.length > 3) {
                this.value = this.value.slice(0, 3);
                return; 
            }
        });
        
        idadeInput.addEventListener('blur', function() {
            const idade = parseInt(this.value) || 0;
            const errorSpan = this.nextElementSibling;
            
            if (!this.value) {
                errorSpan.textContent = 'Este campo é obrigatório';
                errorSpan.style.display = 'block';
                this.style.borderColor = '#ff3860';
            } else if (idade < 16) {
                errorSpan.textContent = 'Idade mínima: 16 anos';
                errorSpan.style.display = 'block';
                this.style.borderColor = '#ff3860';
            } else if (idade > 120) {
                errorSpan.textContent = 'Idade máxima: 120 anos';
                errorSpan.style.display = 'block';
                this.style.borderColor = '#ff3860';
            } else {
                errorSpan.style.display = 'none';
                this.style.borderColor = '#09c372';
            }
        });
    }
}

function setupCPFInput() {
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
            if (this.value.length > 11) {
                this.value = this.value.substring(0, 11);
            }
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });

        cpfInput.addEventListener('blur', function() {
            if (!validateCPF(this.value)) {
                showError(this, 'CPF deve conter 11 dígitos');
            } else {
                clearError(this);
            }
        });
    }
}

function setupTelInput() {
    if (telInput) {
        telInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
            if (this.value.length > 11) {
                this.value = this.value.substring(0, 11);
            }
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value;
        });

        telInput.addEventListener('blur', function() {
            if (!validateTelefone(this.value)) {
                showError(this, 'Telefone deve conter 11 dígitos');
            } else {
                clearError(this);
            }
        });
    }
}

function setupCEPInput() {
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
            if (this.value.length > 8) {
                this.value = this.value.substring(0, 8);
            }
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });

        cepInput.addEventListener('blur', function() {
            const cep = this.value.replace(/\D/g, '');
            if (cep.length === 8) {
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(response => response.json())
                    .then(data => {
                        if (!data.erro) {
                            document.getElementById('rua').value = data.logradouro;
                            document.getElementById('bairro').value = data.bairro;
                            document.getElementById('cidade').value = data.localidade;
                            document.getElementById('estado').value = data.uf;
                        } else {
                            showError(this, 'CEP não encontrado');
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao buscar CEP:', error);
                        showError(this, 'Erro ao buscar CEP');
                    });
            }
        });
    }
}

function setupDocumentUpload() {
    document.getElementById('identidade')?.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.querySelector('.upload-container .preview-image');
                if (!preview) {
                    const img = document.createElement('img');
                    img.classList.add('preview-image');
                    img.style.maxWidth = '100%';
                    img.style.maxHeight = '150px';
                    img.style.marginTop = '10px';
                    img.style.borderRadius = '5px';
                    document.querySelector('.upload-label').appendChild(img);
                }
                document.querySelector('.upload-container .preview-image').src = event.target.result;
                document.querySelector('.upload-label p').textContent = 'Arquivo selecionado: ' + file.name;
            };
            reader.readAsDataURL(file);
        }
    });
}

function setupPasswordToggle() {
    const toggleBtn = document.getElementById('toggle-login-password');
    const passwordInput = document.getElementById('login-password');

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            toggleBtn.innerHTML = `<i class="fa-solid fa-eye${isPassword ? '-slash' : ''}"></i>`;
        });
    }
}

function setupTermsCheckbox() {
    if (termsInput) {
        termsInput.addEventListener('change', function() {
            if (this.checked) {
                document.getElementById('terms-error').style.display = 'none';
            } else {
                document.getElementById('terms-error').style.display = 'block';
            }
        });
    }
}

function setupTrilhaRadios() {
    document.querySelectorAll('input[name="trilha"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('trilha-error').style.display = 'none';
        });
    });
}

function setupEmailValidation() {
    document.querySelector('input[type="email"]')?.addEventListener('blur', function(e) {
        if (!validateEmail(this.value)) {
            showError(this, 'Por favor, insira um email válido');
        } else {
            clearError(this);
        }
    });
}

function setupPasswordValidation() {
    document.querySelector('input[placeholder="Senha"]')?.addEventListener('blur', function(e) {
        if (!validatePassword(this.value)) {
            showError(this, 'A senha deve ter no mínimo 8 caracteres');
        } else {
            clearError(this);
        }
    });
}

function setupUsernameValidation() {
    document.querySelector('input[placeholder="Nome de usuário"]')?.addEventListener('blur', function() {
        if (!validateUsername(this.value)) {
            showError(this, 'Apenas letras e números são permitidos');
        } else {
            clearError(this);
        }
    });
}

function setupFullNameValidation() {
    document.querySelector('input[placeholder="Nome Completo"]')?.addEventListener('blur', function() {
        if (!validateFullName(this.value)) {
            showError(this, 'Apenas letras são permitidas');
        } else {
            clearError(this);
        }
    });
}

function setupMainEventListeners() {
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener('click', () => {
        resetForms();
    });

    backToStep1Btn.addEventListener('click', () => {
        signupStep1.style.display = 'flex';
        signupStep2.style.display = 'none';
        container.classList.remove("active-step2");
    });

    nextToStep2Btn.addEventListener('click', () => {
        if (validateForm(signupStep1)) {
            saveFormData();
            signupStep1.style.display = 'none';
            signupStep2.style.display = 'flex';
            container.classList.add("active-step2");
            adjustScrollHeight();
        }
    });

    prevToStep1Btn.addEventListener('click', () => {
        saveFormData();
        signupStep1.style.display = 'flex';
        signupStep2.style.display = 'none';
        container.classList.remove("active-step2");
    });

    nextToStep3Btn.addEventListener('click', () => {
        const identidadeInput = document.getElementById('identidade');
        
        if (!identidadeInput.files.length) {
            showError(identidadeInput, 'Por favor, carregue um documento de identidade.');
            return; 
        }

        if (validateForm(signupStep2)) {
            saveFormData();
            signupStep2.style.display = 'none';
            signupStep3.style.display = 'flex';
            container.classList.add("active-step3");
            adjustScrollHeight();
        }
    });

    prevToStep2Btn.addEventListener('click', () => {
        saveFormData();
        signupStep2.style.display = 'flex';
        signupStep3.style.display = 'none';
        container.classList.remove("active-step3");
    });

    nextToStep4Btn.addEventListener('click', () => {
        if (validateForm(signupStep3)) {
            saveFormData();
            signupStep3.style.display = 'none';
            signupStep4.style.display = 'flex';
            container.classList.add("active-step4");
            adjustScrollHeight();
        }
    });

    prevToStep3Btn.addEventListener('click', () => {
        saveFormData();
        signupStep3.style.display = 'flex';
        signupStep4.style.display = 'none';
        container.classList.remove("active-step4");
    });

    backToStep2Btn.addEventListener('click', () => {
        saveFormData();
        signupStep2.style.display = 'flex';
        signupStep3.style.display = 'none';
        container.classList.remove("active-step3");
    });

    backToStep3Btn.addEventListener('click', () => {
        saveFormData();
        signupStep3.style.display = 'flex';
        signupStep4.style.display = 'none';
        container.classList.remove("active-step4");
    });

    finalizarCadastroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (validateForm(signupStep4)) {
            const username = document.querySelector('input[placeholder="Nome de usuário"]').value;
            const password = document.querySelector('input[placeholder="Senha"]').value;

            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
            registeredUsers.push({ username, password });
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

            setTimeout(() => {
                showFeedbackModal();
            }, 1000);
            
            resetForms();
            
        } else {
            const firstError = document.querySelector('.error-message[style="display: block;"]') || 
                             document.querySelector('.error-message:not([style])');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

function init() {
    setupIdadeInput();
    setupCPFInput();
    setupTelInput();
    setupCEPInput();
    setupDocumentUpload();
    setupPasswordToggle();
    setupTermsCheckbox();
    setupTrilhaRadios();
    setupEmailValidation();
    setupPasswordValidation();
    setupUsernameValidation();
    setupFullNameValidation();

    setupMainEventListeners();
    setupFeedbackForm();
    handleLogin();
    handleLogout();

    adjustScrollHeight();
    loadFormData();

    document.addEventListener('DOMContentLoaded', () => {
        const savedData = localStorage.getItem('tempFormData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            
            if (formData.step2) container.classList.add("active-step2");
            if (formData.step3) container.classList.add("active-step3");
            if (formData.step4) container.classList.add("active-step4");
            
            if (formData.step4) signupStep4.style.display = 'flex';
            else if (formData.step3) signupStep3.style.display = 'flex';
            else if (formData.step2) signupStep2.style.display = 'flex';
        }
    });
}

window.addEventListener('load', init);