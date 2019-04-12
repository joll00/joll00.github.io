
    var slider = document.getElementById('slider');

    var starRangeValues 

    noUiSlider.create(slider, {
      start: [0, 5],
      step: 1,
      connect: true,
      range: {
        'min': [0],
        'max': [5]
    },
      pips: {
          mode: 'range',
          density: 20
      }
    });

