"""
Django settings for AManagement project.

Generated by 'django-admin startproject' using Django 4.2.14.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_ROOT = f"{BASE_DIR}/Apartment/static/"
CSRF_TRUSTED_ORIGINS = ['http://192.168.1.7:8000', 'https://4425-171-243-49-117.ngrok-free.app']

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-sv2rg0ii4+n$qudt34c5#womke%ol6ubltaaccky9q)um9c)az'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

AUTH_USER_MODEL = 'Apartment.User'

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_ALLOW_ALL = True
# CORS_ORIGIN_WHITELIST = (
#     'http://localhost:8000',  # Địa chỉ IP hoặc tên miền của ứng dụng React Native
#     'http://192.168.1.222:8081:delete',
#     'exp://192.168.1.222:8081:delete'# Ví dụ: địa chỉ IP của Metro bundler
#     # Thêm các địa chỉ IP hoặc tên miền khác nếu cần
# )
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://192.168.1.7:8000",
]


import cloudinary

cloudinary.config(
    cloud_name="dr9h3ttpy",
    api_key="938152162715573",
    api_secret="IIJZy3CtSGsMGw1JVyBHSftoCBU"
)

INTERNAL_IPS = [

    '127.0.0.1',

]
# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'Apartment.apps.ApartmentConfig',
    'rest_framework',
    'drf_yasg',
    'oauth2_provider',
    'ckeditor',
    'ckeditor_uploader',
    'corsheaders',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
    )
}


CKEDITOR_UPLOAD_PATH = "ckeditors/images/"


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'AManagement.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'AManagement.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'apartmentdb',
        'USER': 'root',
        'PASSWORD': 'm1234567890',
        'HOST': ''  # mặc định localhost
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

# OAUTH2_PROVIDER = {
#     'ACCESS_TOKEN_EXPIRE_SECONDS': 36000,
#     'AUTHORIZATION_CODE_EXPIRE_SECONDS': 600,
#     'REFRESH_TOKEN_EXPIRE_SECONDS': 1209600,
#     'ROTATE_REFRESH_TOKENS': True,
#     'SCOPES': {
#         'read': 'Read scope',
#         'write': 'Write scope',
#     },
# }
# OAUTH2_PROVIDER = { 'OAUTH2_BACKEND_CLASS': 'oauth2_provider.oauth2_backends.JSONOAuthLibCore' }
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
CLIENT_ID = '183RXU5hBv3MZjfsfBmTZbfgIPM3OCu5lCYuNgBH'
CLIENT_SECRET = 'MSUr1Q4trFAWEacXHlC2cZg8F56z1rISJTyuscNyNjHpzrr12zrwrcd4QFhVwLSXeKC8URbeEYw8k97s5qe41bHOVy5jdm66SdoiRW8YNXKmlLdluvOUZGM6nDWLcC7F'

