from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from creating_categories.forms import AddCategoryForm, AddCategoryWordForm, AddWordForm
from creating_categories.templatetags.word_id_filters import decrypt_id
from hangman.models import Word, Category
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import redirect


@login_required
def hangman(request):
    if request.method == "POST":
        category_or_word = request.POST.get('category_or_word', None)
        if category_or_word == "category":
            form = AddCategoryForm(request.POST, user=request.user)

            if form.is_valid():
                new_word = Category(name=form.cleaned_data['name'], author=request.user)
                new_word.save()
                return redirect(reverse("creating:hangman"))
        else:
            form = AddCategoryWordForm(request.POST, user=request.user)

            if form.is_valid():
                new_word = Word(name=form.cleaned_data['name'], 
                                category=Category.objects.get(name=form.cleaned_data['category'], author=request.user), 
                                author=request.user)
                new_word.save()
                return redirect(reverse("creating:hangman"))
    else:
        form = AddCategoryWordForm()

    context = {
        "title": "Your categories | Hangman",
        "user_categories": Category.objects.filter(author=request.user).prefetch_related("word"),
        "form": form 
    }

    return render(request, 'creating_categories/creating_categories_hangman.html', context)


@login_required
def wordle(request):

    if request.method == "POST":
        form = AddWordForm(request.POST, user=request.user)

        if form.is_valid():
            new_word = Word(name=form.cleaned_data['name'], author=request.user)
            new_word.save()
            return redirect(reverse("creating:wordle"))
    else:
        form = AddWordForm()

    if request.user.is_authenticated:
        user_words = Word.objects.filter(Q(author=request.user) & ~Q(length=0))

    context = {
        "title": "Your categories | Wordle",
        "user_words": user_words,
        "form": form
    }

    return render(request, 'creating_categories/creating_categories_wordle.html', context)


@login_required
def delete_word(request):
    delete_type = request.POST.get('type')

    encrypted_word_id = request.POST.get('word_id')
    decrypted_word_id = decrypt_id(encrypted_word_id)

    if delete_type == "word":
        deleted_word = Word.objects.get(id=decrypted_word_id, author=request.user)
    elif delete_type == "category": 
        deleted_word = Category.objects.get(id=decrypted_word_id, author=request.user)

    if deleted_word:
        deleted_word.delete()
        return JsonResponse({'status': 'success'})
