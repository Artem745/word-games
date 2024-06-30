from django.shortcuts import render


def index(request):
    context ={
        "title": "Your categories"
    }

    return render(request, 'creating_categories/creating_categories.html', context)