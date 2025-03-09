from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return HttpResponse('Hello world...')


def user_details(request):
    mf = {
        'name': 'Maryhill',
        'age': 200,
        'origin': 'Uganda',
    }
    return render(request, 'index.html', mf)
