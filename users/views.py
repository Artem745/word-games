from django.contrib import auth
from django.shortcuts import redirect, render
from django.urls import reverse

from users.forms import UserLoginForm, UserRegistrationForm


def login(request):
    if request.method == "POST":
        form = UserLoginForm(data=request.POST)
        if form.is_valid():
            email = request.POST['email']
            password = request.POST['password']

            user = auth.authenticate(email=email, password=password)
            if user:
                auth.login(request, user)
                return redirect(reverse("creating_categories:index"))
    else:
        form = UserLoginForm()

    context = {
        'title': 'Log in',
        'form': form
    }
    return render(request, "users/login.html", context)

def signup(request):
    if request.method == "POST":
        form = UserRegistrationForm(data=request.POST)
        if form.is_valid():

            form.save()

            user = form.instance
            auth.login(request, user)
            return redirect(reverse("creating_categories:index"))
    else:
        form = UserRegistrationForm()

    context = {
        'title': 'Sign up',
        'form': form
    }
    return render(request, "users/signup.html", context)

def logout(request):
    auth.logout(request)
    return redirect(reverse('users:login'))