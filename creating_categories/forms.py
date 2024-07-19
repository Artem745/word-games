from django import forms
from hangman.models import Category, Word

class AddWordForm(forms.ModelForm):
    class Meta:
        model = Word
        fields = ['name']

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super(AddWordForm, self).__init__(*args, **kwargs)

    def clean_name(self):
        name = self.cleaned_data.get('name')
        if Word.objects.filter(name=name, category=None, author=self.user).exists():
            raise forms.ValidationError('You already have a word with this name!')
        return name


class AddCategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name']

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super(AddCategoryForm, self).__init__(*args, **kwargs)

    def clean_name(self):
        name = self.cleaned_data.get('name')
        if Category.objects.filter(name=name, author=self.user).exists():
            raise forms.ValidationError('You already have a category with this name!')
        return name


class AddCategoryWordForm(forms.Form):
    name = forms.CharField(max_length=7, min_length=3)
    category = forms.CharField(max_length=15)
    
    class Meta:
        model = Word
        fields = ['name', 'category']

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super(AddCategoryWordForm, self).__init__(*args, **kwargs)

    def clean(self):
        cleaned_data = super().clean()
        name = cleaned_data.get('name')
        category_name = cleaned_data.get('category')

        if name and category_name:
            category = Category.objects.get(name=category_name, author=self.user)
            if category and Word.objects.filter(name=name, category=category, author=self.user).exists():
                raise forms.ValidationError('You already have a word with this name and category!')
        return cleaned_data