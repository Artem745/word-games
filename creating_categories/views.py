from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def index(request):
    context ={
        "title": "Your categories"
    }

    return render(request, 'creating_categories/creating_categories.html', context)