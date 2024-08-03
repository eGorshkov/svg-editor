export const MOCK_DEFAULT_LAYERS = {
  config: {},
  layers: [
    {
      order: 0,
      name: 'Тест',
      showable: true,
      items: [
        {
          order: 0,
          name: 'Детская №1',
          showable: true,
          items: [
            {
              uniqueId: '968341145',
              order: 0,
              type: 'square',
              config: { width: 200, height: 200, x: 500, y: 300, strokeWidth: 0.2 }
            },
            {
              uniqueId: '9838028689',
              order: 1,
              type: 'door',
              config: {
                width: 80,
                height: 80,
                x: 650,
                y: 450,
                stroke: 'black',
                strokeWidth: 3,
                strokeDasharray: 0,
                transform: { rotate: 180 }
              }
            }
          ]
        },
        {
          order: 1,
          name: 'Детская №2',
          showable: true,
          items: [
            {
              uniqueId: '3907157261',
              order: 0,
              type: 'square',
              config: { width: 200, height: 200, x: 500, y: 600, strokeWidth: 0.2 }
            },
            {
              uniqueId: '3923820461',
              order: 1,
              type: 'door',
              config: {
                width: 80,
                height: 80,
                x: 650,
                y: 600,
                stroke: 'black',
                strokeWidth: 3,
                strokeDasharray: 0,
                transform: { rotate: 0, scaleX: -1 }
              }
            }
          ]
        },
        {
          order: 2,
          name: 'Мастер-спальня',
          showable: true,
          items: [
            {
              uniqueId: '4189331679',
              order: 1,
              type: 'square',
              config: { width: 300, height: 200, x: 1000, y: 600, strokeWidth: 0.2 }
            }
          ]
        },
        {
          order: 3,
          name: 'Гостиная + Кухня',
          showable: true,
          items: [
            {
              uniqueId: '4725691735',
              order: 0,
              type: 'square',
              config: { width: 300, height: 200, x: 700, y: 300, strokeWidth: 0.2 }
            },
            {
              uniqueId: '2964473565',
              order: 1,
              type: 'square',
              config: { width: 300, height: 200, x: 1000, y: 300, strokeWidth: 0.2 }
            }
          ]
        },
        {
          order: 4,
          name: 'Сан узлы',
          showable: true,
          items: [
            {
              uniqueId: '2214322159',
              order: 0,
              type: 'square',
              config: { width: 100, height: 100, x: 500, y: 500, strokeWidth: 0.2 }
            },
            {
              uniqueId: '2475522294',
              order: 1,
              type: 'square',
              config: { width: 100, height: 100, x: 1200, y: 500, strokeWidth: 0.2 }
            }
          ]
        },
        {
          order: 5,
          name: 'Котельня',
          showable: true,
          items: [
            {
              uniqueId: '3381000762',
              order: 0,
              type: 'square',
              config: { width: 100, height: 200, x: 700, y: 600, strokeWidth: 0.2 }
            }
          ]
        },
        {
          order: 6,
          name: 'Прихожая',
          showable: true,
          items: [
            {
              uniqueId: '3680888185',
              order: 0,
              type: 'square',
              config: { width: 200, height: 100, x: 800, y: 600, strokeWidth: 0.2 }
            }
          ]
        }
      ]
    }
  ]
};
