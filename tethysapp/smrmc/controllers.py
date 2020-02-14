from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import Button
from tethys_sdk.gizmos import *
from django.http import HttpResponse, JsonResponse

import requests
import json
import urllib.request
import datetime as dt
import plotly.graph_objs as go
from csv import writer as csv_writer

def home(request):
    """
    Controller for the app home page.
    """

    context = {
    }

    return render(request, 'smrmc/home.html', context)

def tiempo_real(request):
    """
    Controller for the app tiempo real page.
    """


    context = {
    }

    return render(request, 'smrmc/tiempo_real.html', context)

def historico(request):
    """
    Controller for the app historic data page.
    """

    context = {
    }

    return render(request, 'smrmc/historico.html', context)

def pronostico(request):
    """
    Controller for the app pronostico page.
    """

    context = {
    }

    return render(request, 'smrmc/pronostico.html', context)

def about(request):
    """
    Controller for the app about page.
    """

    context = {
    }

    return render(request, 'smrmc/about.html', context)

def get_realTimeObsDataH(request):
    """
    Get data from fews stations
    """

    get_data = request.GET

    try:
        codEstacion = get_data['stationcode']
        nomEstacion = get_data['stationname']

        url2 = 'http://fews.ideam.gov.co/colombia/jsonH/00' + str(codEstacion) + 'Hobs.json'

        req2 = urllib.request.Request(url2)
        opener2 = urllib.request.build_opener()
        f2 = opener2.open(req2)
        data2 = json.loads(f2.read())

        obsWaterLevel = (data2.get('obs'))
        obsWaterLevel = (obsWaterLevel.get('data'))

        datesObsWaterLevel = [row[0] for row in obsWaterLevel]
        obsWaterLevel = [row[1] for row in obsWaterLevel]

        dates = []
        WaterLevel = []

        for i in range(0, len(datesObsWaterLevel) - 1):
            year = int(datesObsWaterLevel[i][0:4])
            month = int(datesObsWaterLevel[i][5:7])
            day = int(datesObsWaterLevel[i][8:10])
            hh = int(datesObsWaterLevel[i][11:13])
            mm = int(datesObsWaterLevel[i][14:16])
            dates.append(dt.datetime(year, month, day, hh, mm))
            WaterLevel.append(obsWaterLevel[i])

        datesObsWaterLevel = dates
        obsWaterLevel = WaterLevel

        obs_WL = go.Scatter(
            x=datesObsWaterLevel,
            y=obsWaterLevel,
            name='Observed'
        )

        layout = go.Layout(title='Nivel Observado en ' + nomEstacion,
                           xaxis=dict(
                               title='Fecha', ),
                           yaxis=dict(
                               title='Nivel (m)',
                               autorange=True),
                           showlegend=False)

        chart_obj = PlotlyView(
            go.Figure(data=[obs_WL],
                      layout=layout)
        )

        context = {
            'gizmo_object': chart_obj,
        }

        return render(request, 'smrmc/gizmo_ajax.html', context)

    except Exception as e:
        print(str(e))
        return JsonResponse({'error': 'No  data found for the station.'})

def download_realTimeObsDataH(request):
    """
    Get observed data from csv files in Hydroshare
    """

    get_data = request.GET

    try:
        codEstacion = get_data['stationcode']
        nomEstacion = get_data['stationname']

        url2 = 'http://fews.ideam.gov.co/colombia/jsonH/00' + str(codEstacion) + 'Hobs.json'

        req2 = urllib.request.Request(url2)
        opener2 = urllib.request.build_opener()
        f2 = opener2.open(req2)
        data2 = json.loads(f2.read())

        obsWaterLevel = (data2.get('obs'))
        obsWaterLevel = (obsWaterLevel.get('data'))

        datesObsWaterLevel = [row[0] for row in obsWaterLevel]
        obsWaterLevel = [row[1] for row in obsWaterLevel]

        dates = []
        WaterLevel = []

        for i in range(0, len(datesObsWaterLevel) - 1):
            year = int(datesObsWaterLevel[i][0:4])
            month = int(datesObsWaterLevel[i][5:7])
            day = int(datesObsWaterLevel[i][8:10])
            hh = int(datesObsWaterLevel[i][11:13])
            mm = int(datesObsWaterLevel[i][14:16])
            dates.append(dt.datetime(year, month, day, hh, mm))
            WaterLevel.append(obsWaterLevel[i])

        datesObsWaterLevel = dates
        obsWaterLevel = WaterLevel

        pairs = [list(a) for a in zip(datesObsWaterLevel, obsWaterLevel)]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=observed_water_level_{0}.csv'.format(codEstacion)

        writer = csv_writer(response)
        writer.writerow(['datetime', 'water level (m)'])

        for row_data in pairs:
            writer.writerow(row_data)

        return response

    except Exception as e:
        print(str(e))
        return JsonResponse({'error': 'An unknown error occurred while retrieving the Discharge Data.'})