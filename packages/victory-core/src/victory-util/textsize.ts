// http://www.pearsonified.com/2012/01/characters-per-line.php
/* eslint-disable no-magic-numbers */
import { assign, defaults, memoize } from "lodash";

// Based on measuring specific character widths
// as in the following example https://bl.ocks.org/tophtucker/62f93a4658387bb61e4510c37e2e97cf
// prettier-ignore
const fonts = {
  "American Typewriter": {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.25,0.4203125,0.3296875,0.6,0.6375,0.8015625,0.8203125,0.1875,0.45625,0.45625,0.6375,0.5,0.2734375,0.309375,0.2734375,0.4390625,0.6375,0.6375,0.6375,0.6375,0.6375,0.6375,0.6375,0.6375,0.6375,0.6375,0.2734375,0.2734375,0.5,0.5,0.5,0.6,0.6921875,0.7640625,0.6921875,0.6375,0.728125,0.6734375,0.6203125,0.7109375,0.784375,0.3828125,0.6421875,0.7859375,0.6375,0.9484375,0.7640625,0.65625,0.6375,0.65625,0.7296875,0.6203125,0.6375,0.7109375,0.740625,0.940625,0.784375,0.7578125,0.6203125,0.4375,0.5,0.4375,0.5,0.5,0.4921875,0.5734375,0.5890625,0.5109375,0.6,0.528125,0.43125,0.5578125,0.6375,0.3109375,0.40625,0.6234375,0.309375,0.928125,0.6375,0.546875,0.6,0.58125,0.4921875,0.4921875,0.4,0.6203125,0.625,0.825,0.6375,0.640625,0.528125,0.5,0.5,0.5,0.6671875],
    avg: 0.5793421052631578
  },
  Arial: {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.278125,0.278125,0.35625,0.55625,0.55625,0.890625,0.6671875,0.1921875,0.334375,0.334375,0.390625,0.584375,0.278125,0.334375,0.278125,0.278125,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.278125,0.278125,0.584375,0.584375,0.584375,0.55625,1.015625,0.6703125,0.6671875,0.7234375,0.7234375,0.6671875,0.6109375,0.778125,0.7234375,0.278125,0.5,0.6671875,0.55625,0.834375,0.7234375,0.778125,0.6671875,0.778125,0.7234375,0.6671875,0.6109375,0.7234375,0.6671875,0.9453125,0.6671875,0.6671875,0.6109375,0.278125,0.278125,0.278125,0.4703125,0.584375,0.334375,0.55625,0.55625,0.5,0.55625,0.55625,0.3125,0.55625,0.55625,0.2234375,0.2703125,0.5,0.2234375,0.834375,0.55625,0.55625,0.55625,0.55625,0.346875,0.5,0.278125,0.55625,0.5,0.7234375,0.5,0.5,0.5,0.334375,0.2609375,0.334375,0.584375],
    avg: 0.528733552631579
  },
  "Arial Black": {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.33125,0.334375,0.5,0.6609375,0.6671875,1,0.890625,0.278125,0.390625,0.390625,0.55625,0.6609375,0.334375,0.334375,0.334375,0.28125,0.6671875,0.6671875,0.6671875,0.6671875,0.6671875,0.6671875,0.6671875,0.6671875,0.6671875,0.6671875,0.334375,0.334375,0.6609375,0.6609375,0.6609375,0.6109375,0.7453125,0.78125,0.778125,0.778125,0.778125,0.7234375,0.6671875,0.834375,0.834375,0.390625,0.6671875,0.834375,0.6671875,0.9453125,0.834375,0.834375,0.7234375,0.834375,0.78125,0.7234375,0.7234375,0.834375,0.7796875,1.003125,0.78125,0.78125,0.7234375,0.390625,0.28125,0.390625,0.6609375,0.5125,0.334375,0.6671875,0.6671875,0.6671875,0.6671875,0.6671875,0.41875,0.6671875,0.6671875,0.334375,0.384375,0.6671875,0.334375,1,0.6671875,0.6671875,0.6671875,0.6671875,0.4703125,0.6109375,0.4453125,0.6671875,0.6140625,0.946875,0.6671875,0.615625,0.55625,0.390625,0.278125,0.390625,0.6609375],
    avg: 0.6213157894736842
  },
  Baskerville: {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.25,0.25,0.40625,0.6671875,0.490625,0.875,0.7015625,0.178125,0.2453125,0.246875,0.4171875,0.6671875,0.25,0.3125,0.25,0.521875,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.25,0.25,0.6671875,0.6671875,0.6671875,0.396875,0.9171875,0.684375,0.615625,0.71875,0.7609375,0.625,0.553125,0.771875,0.803125,0.3546875,0.515625,0.78125,0.6046875,0.928125,0.75,0.8234375,0.5625,0.96875,0.7296875,0.5421875,0.6984375,0.771875,0.7296875,0.9484375,0.771875,0.678125,0.6359375,0.3640625,0.521875,0.3640625,0.46875,0.5125,0.334375,0.46875,0.521875,0.428125,0.521875,0.4375,0.3890625,0.4765625,0.53125,0.25,0.359375,0.4640625,0.240625,0.803125,0.53125,0.5,0.521875,0.521875,0.365625,0.334375,0.2921875,0.521875,0.4640625,0.678125,0.4796875,0.465625,0.428125,0.4796875,0.5109375,0.4796875,0.6671875],
    avg: 0.5323519736842108
  },
  Courier: {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.5984375,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6078125,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.61875,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.615625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6140625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625],
    avg: 0.6020559210526316
  },
  "Courier New": {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.5984375,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625],
    avg: 0.6015296052631579
  },
  cursive: {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.1921875,0.24375,0.40625,0.5671875,0.3984375,0.721875,0.909375,0.2328125,0.434375,0.365625,0.4734375,0.5578125,0.19375,0.3484375,0.19375,0.7734375,0.503125,0.4171875,0.5453125,0.45,0.6046875,0.4703125,0.5984375,0.55625,0.503125,0.5546875,0.20625,0.2,0.5625,0.5546875,0.546875,0.403125,0.70625,0.734375,0.7078125,0.64375,0.85,0.753125,0.75,0.6484375,1.0765625,0.44375,0.5359375,0.8359375,0.653125,1.0109375,1.1515625,0.6796875,0.6984375,1.0625,0.8234375,0.5125,0.9234375,0.8546875,0.70625,0.9109375,0.7421875,0.715625,0.6015625,0.4640625,0.3359375,0.4109375,0.5421875,0.5421875,0.4328125,0.5125,0.5,0.3859375,0.7375,0.359375,0.75625,0.540625,0.5328125,0.3203125,0.5296875,0.5015625,0.484375,0.7890625,0.5640625,0.4203125,0.703125,0.471875,0.4734375,0.35,0.4125,0.5640625,0.471875,0.6484375,0.5296875,0.575,0.4140625,0.415625,0.20625,0.3796875,0.5421875],
    avg: 0.5604440789473684
  },
  fantasy: {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.215625,0.2625,0.3265625,0.6109375,0.534375,0.7625,0.7828125,0.2,0.4359375,0.4359375,0.3765625,0.5109375,0.2796875,0.4609375,0.2796875,0.5296875,0.6640625,0.253125,0.521875,0.4765625,0.6640625,0.490625,0.528125,0.5546875,0.496875,0.5421875,0.2796875,0.2796875,0.5625,0.4609375,0.5625,0.4828125,0.609375,0.740625,0.7234375,0.740625,0.8265625,0.7234375,0.6171875,0.7359375,0.765625,0.240625,0.5453125,0.715625,0.6078125,0.8640625,0.653125,0.9125,0.6484375,0.946875,0.6921875,0.653125,0.6953125,0.8015625,0.58125,0.784375,0.671875,0.6265625,0.690625,0.4359375,0.5296875,0.4359375,0.53125,0.5,0.2875,0.5375,0.603125,0.4984375,0.60625,0.53125,0.434375,0.6421875,0.56875,0.209375,0.4671875,0.5484375,0.2203125,0.709375,0.55,0.5984375,0.6140625,0.5765625,0.40625,0.4734375,0.3734375,0.559375,0.4421875,0.6421875,0.4890625,0.578125,0.4484375,0.2546875,0.2203125,0.2546875,0.55],
    avg: 0.536496710526316
  },
  Geneva: {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.3328125,0.3046875,0.5,0.6671875,0.6671875,0.90625,0.728125,0.3046875,0.446875,0.446875,0.5078125,0.6671875,0.3046875,0.3796875,0.3046875,0.5390625,0.6671875,0.6671875,0.6671875,0.6671875,0.6671875,0.6671875,0.6671875,0.6671875,0.6671875,0.6671875,0.3046875,0.3046875,0.6671875,0.6671875,0.6671875,0.56875,0.871875,0.728125,0.6375,0.6515625,0.7015625,0.5765625,0.5546875,0.675,0.690625,0.2421875,0.4921875,0.6640625,0.584375,0.7890625,0.709375,0.7359375,0.584375,0.78125,0.60625,0.60625,0.640625,0.6671875,0.728125,0.946875,0.6109375,0.6109375,0.5765625,0.446875,0.5390625,0.446875,0.6671875,0.6671875,0.5921875,0.5546875,0.6109375,0.546875,0.603125,0.5765625,0.390625,0.6109375,0.584375,0.2359375,0.334375,0.5390625,0.2359375,0.8953125,0.584375,0.60625,0.603125,0.603125,0.3875,0.509375,0.44375,0.584375,0.565625,0.78125,0.53125,0.571875,0.5546875,0.4515625,0.246875,0.4515625,0.6671875],
    avg: 0.5762664473684211
  },
  Georgia: {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2421875,0.33125,0.4125,0.64375,0.6109375,0.81875,0.7109375,0.215625,0.375,0.375,0.4734375,0.64375,0.2703125,0.375,0.2703125,0.46875,0.6140625,0.4296875,0.559375,0.553125,0.565625,0.5296875,0.5671875,0.503125,0.596875,0.5671875,0.3125,0.3125,0.64375,0.64375,0.64375,0.4796875,0.9296875,0.715625,0.6546875,0.6421875,0.75,0.6546875,0.6,0.7265625,0.815625,0.390625,0.51875,0.7203125,0.6046875,0.928125,0.7671875,0.7453125,0.6109375,0.7453125,0.7234375,0.5625,0.61875,0.7578125,0.70625,0.99375,0.7125,0.6640625,0.6015625,0.375,0.46875,0.375,0.64375,0.65,0.5,0.5046875,0.56875,0.4546875,0.575,0.484375,0.39375,0.509375,0.5828125,0.29375,0.3671875,0.546875,0.2875,0.88125,0.5921875,0.5390625,0.571875,0.5640625,0.4109375,0.4328125,0.3453125,0.5765625,0.5203125,0.75625,0.50625,0.5171875,0.4453125,0.43125,0.375,0.43125,0.64375],
    avg: 0.5551809210526316
  },
  "Gill Sans": {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2765625,0.271875,0.3546875,0.584375,0.5421875,0.6765625,0.625,0.1890625,0.3234375,0.3234375,0.4171875,0.584375,0.2203125,0.3234375,0.2203125,0.28125,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.2203125,0.2296875,0.584375,0.584375,0.584375,0.334375,1.0109375,0.6671875,0.5640625,0.709375,0.75,0.5,0.4703125,0.740625,0.7296875,0.25,0.3125,0.65625,0.490625,0.78125,0.78125,0.8234375,0.5109375,0.8234375,0.6046875,0.459375,0.6046875,0.709375,0.6046875,1.0421875,0.709375,0.6046875,0.646875,0.334375,0.28125,0.334375,0.4703125,0.5828125,0.334375,0.428125,0.5,0.4390625,0.5109375,0.4796875,0.296875,0.428125,0.5,0.2203125,0.2265625,0.5,0.2203125,0.771875,0.5,0.553125,0.5,0.5,0.3984375,0.3859375,0.334375,0.5,0.4390625,0.7203125,0.5,0.4390625,0.4171875,0.334375,0.2609375,0.334375,0.584375],
    avg: 0.4933717105263159
  },
  Helvetica: {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2796875,0.2765625,0.3546875,0.5546875,0.5546875,0.8890625,0.665625,0.190625,0.3328125,0.3328125,0.3890625,0.5828125,0.2765625,0.3328125,0.2765625,0.3015625,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.2765625,0.2765625,0.584375,0.5828125,0.584375,0.5546875,1.0140625,0.665625,0.665625,0.721875,0.721875,0.665625,0.609375,0.7765625,0.721875,0.2765625,0.5,0.665625,0.5546875,0.8328125,0.721875,0.7765625,0.665625,0.7765625,0.721875,0.665625,0.609375,0.721875,0.665625,0.94375,0.665625,0.665625,0.609375,0.2765625,0.3546875,0.2765625,0.4765625,0.5546875,0.3328125,0.5546875,0.5546875,0.5,0.5546875,0.5546875,0.2765625,0.5546875,0.5546875,0.221875,0.240625,0.5,0.221875,0.8328125,0.5546875,0.5546875,0.5546875,0.5546875,0.3328125,0.5,0.2765625,0.5546875,0.5,0.721875,0.5,0.5,0.5,0.3546875,0.259375,0.353125,0.5890625],
    avg: 0.5279276315789471
  },
  "Helvetica Neue": {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.278125,0.259375,0.4265625,0.55625,0.55625,1,0.6453125,0.278125,0.2703125,0.26875,0.353125,0.6,0.278125,0.3890625,0.278125,0.36875,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.278125,0.278125,0.6,0.6,0.6,0.55625,0.8,0.6625,0.6859375,0.7234375,0.7046875,0.6125,0.575,0.759375,0.7234375,0.259375,0.5203125,0.6703125,0.55625,0.871875,0.7234375,0.7609375,0.6484375,0.7609375,0.6859375,0.6484375,0.575,0.7234375,0.6140625,0.9265625,0.6125,0.6484375,0.6125,0.259375,0.36875,0.259375,0.6,0.5,0.25625,0.5375,0.59375,0.5375,0.59375,0.5375,0.2984375,0.575,0.55625,0.2234375,0.2375,0.5203125,0.2234375,0.853125,0.55625,0.575,0.59375,0.59375,0.334375,0.5,0.315625,0.55625,0.5,0.759375,0.51875,0.5,0.48125,0.334375,0.2234375,0.334375,0.6],
    avg: 0.5279440789473684
  },
  "Hoefler Text": {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2359375,0.2234375,0.3921875,0.7125,0.49375,0.8859375,0.771875,0.2125,0.3078125,0.309375,0.375,0.4234375,0.234375,0.3125,0.234375,0.3,0.5828125,0.365625,0.434375,0.3921875,0.5234375,0.3984375,0.5125,0.4328125,0.46875,0.5125,0.234375,0.234375,0.515625,0.4234375,0.515625,0.340625,0.7609375,0.7359375,0.6359375,0.721875,0.8125,0.6375,0.5875,0.8078125,0.853125,0.4296875,0.503125,0.78125,0.609375,0.9609375,0.8515625,0.8140625,0.6125,0.8140625,0.71875,0.49375,0.7125,0.76875,0.771875,1.125,0.7765625,0.7734375,0.65625,0.321875,0.3078125,0.321875,0.3546875,0.5,0.3375,0.446875,0.5359375,0.45,0.5296875,0.4546875,0.425,0.4921875,0.54375,0.2671875,0.240625,0.5390625,0.25,0.815625,0.5375,0.5234375,0.5390625,0.5421875,0.365625,0.36875,0.35625,0.5171875,0.5015625,0.75,0.5,0.509375,0.44375,0.2421875,0.14375,0.2421875,0.35],
    avg: 0.5116447368421051
  },
  "Montserrat": {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2625,0.2609375,0.3734375,0.696875,0.615625,0.8296875,0.6703125,0.203125,0.3296875,0.3296875,0.3875,0.575,0.2125,0.3828125,0.2125,0.3953125,0.6625,0.3625,0.56875,0.5640625,0.6625,0.5671875,0.609375,0.5890625,0.6390625,0.609375,0.2125,0.2125,0.575,0.575,0.575,0.5671875,1.034375,0.7171875,0.7546875,0.7203125,0.8265625,0.6703125,0.634375,0.7734375,0.8140625,0.303125,0.5078125,0.7125,0.5890625,0.95625,0.8140625,0.8390625,0.71875,0.8390625,0.7234375,0.615625,0.575,0.7921875,0.6984375,1.1125,0.65625,0.6359375,0.6515625,0.31875,0.396875,0.31875,0.5765625,0.5,0.6,0.590625,0.678125,0.5640625,0.678125,0.6046875,0.375,0.6875,0.678125,0.2703125,0.365625,0.6015625,0.2703125,1.0625,0.678125,0.628125,0.678125,0.678125,0.4015625,0.4890625,0.40625,0.6734375,0.5421875,0.8796875,0.534375,0.5671875,0.5125,0.334375,0.2953125,0.334375,0.575],
    avg: 0.571792763157895
  },
  monospace: {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.5984375,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6078125,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.61875,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.615625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6140625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625,0.6015625],
    avg: 0.6020559210526316
  },
  Overpass: {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2296875,0.2765625,0.4203125,0.68125,0.584375,0.8515625,0.7015625,0.2203125,0.3453125,0.3453125,0.53125,0.63125,0.2234375,0.3953125,0.2234375,0.509375,0.65,0.4046875,0.6171875,0.60625,0.6484375,0.60625,0.6015625,0.5375,0.615625,0.6015625,0.2234375,0.2234375,0.63125,0.63125,0.63125,0.5015625,0.8203125,0.696875,0.6671875,0.65,0.6859375,0.6015625,0.559375,0.690625,0.7078125,0.2953125,0.565625,0.678125,0.58125,0.8046875,0.7109375,0.740625,0.6421875,0.740625,0.6765625,0.6046875,0.590625,0.696875,0.6640625,0.853125,0.65,0.6671875,0.6625,0.3734375,0.509375,0.3734375,0.63125,0.5125,0.4,0.5328125,0.5625,0.51875,0.5625,0.546875,0.3359375,0.5625,0.565625,0.25625,0.3203125,0.55,0.265625,0.85,0.565625,0.5671875,0.5625,0.5625,0.4046875,0.4765625,0.3796875,0.565625,0.521875,0.7265625,0.53125,0.5390625,0.5125,0.3671875,0.275,0.3671875,0.63125],
    avg: 0.5430756578947369
  },
  Palatino: {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.25,0.278125,0.371875,0.60625,0.5,0.840625,0.778125,0.209375,0.334375,0.334375,0.390625,0.60625,0.2578125,0.334375,0.25,0.60625,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.25,0.25,0.60625,0.60625,0.60625,0.4453125,0.7484375,0.778125,0.6109375,0.709375,0.775,0.6109375,0.55625,0.7640625,0.8328125,0.3375,0.346875,0.7265625,0.6109375,0.946875,0.83125,0.7875,0.6046875,0.7875,0.66875,0.525,0.6140625,0.778125,0.7234375,1,0.6671875,0.6671875,0.6671875,0.334375,0.60625,0.334375,0.60625,0.5,0.334375,0.5,0.565625,0.4453125,0.6109375,0.4796875,0.340625,0.55625,0.5828125,0.2921875,0.2671875,0.5640625,0.2921875,0.8828125,0.5828125,0.546875,0.6015625,0.5609375,0.3953125,0.425,0.3265625,0.603125,0.565625,0.834375,0.5171875,0.55625,0.5,0.334375,0.60625,0.334375,0.60625],
    avg: 0.5408552631578947
  },
  "RedHatText": {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2328125,0.2203125,0.35625,0.6890625,0.55,0.7390625,0.6703125,0.2140625,0.4015625,0.4015625,0.4546875,0.53125,0.2203125,0.45625,0.2203125,0.515625,0.6609375,0.3078125,0.5484375,0.5875,0.61875,0.5703125,0.6203125,0.559375,0.6140625,0.6203125,0.2203125,0.2234375,0.465625,0.534375,0.465625,0.5125,0.7671875,0.6609375,0.6703125,0.7265625,0.728125,0.6203125,0.6109375,0.8,0.73125,0.253125,0.6,0.6125,0.6078125,0.8625,0.7390625,0.8109375,0.6546875,0.809375,0.6484375,0.6234375,0.6171875,0.7125,0.6609375,0.8984375,0.6546875,0.646875,0.60625,0.3625,0.5203125,0.3625,0.540625,0.4609375,0.5234375,0.5265625,0.584375,0.509375,0.5828125,0.5578125,0.3703125,0.5828125,0.553125,0.2234375,0.24375,0.4890625,0.2234375,0.8453125,0.553125,0.58125,0.584375,0.5828125,0.353125,0.453125,0.378125,0.553125,0.5015625,0.6984375,0.4875,0.4984375,0.459375,0.3953125,0.2921875,0.3953125,0.58125],
    avg: 0.5341940789473685
  },
  "sans-serif": {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.278125,0.278125,0.35625,0.55625,0.55625,0.890625,0.6671875,0.1921875,0.334375,0.334375,0.390625,0.584375,0.278125,0.334375,0.278125,0.303125,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.55625,0.278125,0.278125,0.5859375,0.584375,0.5859375,0.55625,1.015625,0.6671875,0.6671875,0.7234375,0.7234375,0.6671875,0.6109375,0.778125,0.7234375,0.278125,0.5,0.6671875,0.55625,0.834375,0.7234375,0.778125,0.6671875,0.778125,0.7234375,0.6671875,0.6109375,0.7234375,0.6671875,0.9453125,0.6671875,0.6671875,0.6109375,0.278125,0.35625,0.278125,0.478125,0.55625,0.334375,0.55625,0.55625,0.5,0.55625,0.55625,0.278125,0.55625,0.55625,0.2234375,0.2421875,0.5,0.2234375,0.834375,0.55625,0.55625,0.55625,0.55625,0.334375,0.5,0.278125,0.55625,0.5,0.7234375,0.5,0.5,0.5,0.35625,0.2609375,0.3546875,0.590625],
    avg: 0.5293256578947368
  },
  Seravek: {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.215625,0.296875,0.4171875,0.6734375,0.4953125,0.9125,0.740625,0.2421875,0.3375,0.3375,0.409375,0.60625,0.2609375,0.35625,0.25625,0.41875,0.5921875,0.3515625,0.475,0.4875,0.5375,0.509375,0.5484375,0.4546875,0.5421875,0.5484375,0.25625,0.2546875,0.5875,0.6171875,0.5875,0.4578125,0.8140625,0.6765625,0.5703125,0.6109375,0.684375,0.5109375,0.4953125,0.678125,0.6859375,0.2625,0.2625,0.5859375,0.4734375,0.846875,0.709375,0.740625,0.509375,0.740625,0.584375,0.5015625,0.528125,0.675,0.5953125,0.9453125,0.596875,0.540625,0.540625,0.359375,0.4203125,0.359375,0.5109375,0.421875,0.4046875,0.5015625,0.5421875,0.446875,0.5453125,0.484375,0.38125,0.5140625,0.5546875,0.240625,0.2640625,0.490625,0.2765625,0.8625,0.5546875,0.546875,0.5453125,0.5453125,0.3625,0.41875,0.3890625,0.5453125,0.4703125,0.7546875,0.4921875,0.4609375,0.453125,0.4015625,0.2640625,0.4015625,0.58125],
    avg: 0.5044078947368421
  },
  serif: {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2484375,0.334375,0.409375,0.5,0.5,0.834375,0.778125,0.18125,0.334375,0.334375,0.5,0.5640625,0.25,0.334375,0.25,0.278125,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.278125,0.278125,0.5640625,0.5640625,0.5640625,0.4453125,0.921875,0.7234375,0.6671875,0.6671875,0.7234375,0.6109375,0.55625,0.7234375,0.7234375,0.334375,0.390625,0.7234375,0.6109375,0.890625,0.7234375,0.7234375,0.55625,0.7234375,0.6671875,0.55625,0.6109375,0.7234375,0.7234375,0.9453125,0.7234375,0.7234375,0.6109375,0.334375,0.340625,0.334375,0.4703125,0.5,0.3453125,0.4453125,0.5,0.4453125,0.5,0.4453125,0.3828125,0.5,0.5,0.278125,0.3359375,0.5,0.278125,0.778125,0.5,0.5,0.5,0.5,0.3375,0.390625,0.2796875,0.5,0.5,0.7234375,0.5,0.5,0.4453125,0.48125,0.2015625,0.48125,0.5421875],
    avg: 0.5126315789473684
  },
  Tahoma: {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.3109375,0.3328125,0.4015625,0.728125,0.546875,0.9765625,0.70625,0.2109375,0.3828125,0.3828125,0.546875,0.728125,0.303125,0.3640625,0.303125,0.3953125,0.546875,0.546875,0.546875,0.546875,0.546875,0.546875,0.546875,0.546875,0.546875,0.546875,0.3546875,0.3546875,0.728125,0.728125,0.728125,0.475,0.909375,0.6109375,0.590625,0.6015625,0.6796875,0.5625,0.521875,0.66875,0.6765625,0.3734375,0.4171875,0.6046875,0.4984375,0.771875,0.66875,0.7078125,0.5515625,0.7078125,0.6375,0.5578125,0.5875,0.65625,0.60625,0.903125,0.58125,0.5890625,0.559375,0.3828125,0.39375,0.3828125,0.728125,0.5625,0.546875,0.525,0.553125,0.4625,0.553125,0.5265625,0.3546875,0.553125,0.5578125,0.2296875,0.328125,0.51875,0.2296875,0.840625,0.5578125,0.54375,0.553125,0.553125,0.3609375,0.446875,0.3359375,0.5578125,0.4984375,0.7421875,0.4953125,0.4984375,0.4453125,0.48125,0.3828125,0.48125,0.728125],
    avg: 0.5384374999999998
  },
  "Times New Roman": {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2484375,0.334375,0.409375,0.5,0.5,0.834375,0.778125,0.18125,0.334375,0.334375,0.5,0.5640625,0.25,0.334375,0.25,0.28125,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.278125,0.278125,0.5640625,0.5640625,0.5640625,0.4453125,0.921875,0.7234375,0.6671875,0.6671875,0.7234375,0.6109375,0.55625,0.7234375,0.7234375,0.334375,0.390625,0.73125,0.6109375,0.890625,0.7375,0.7234375,0.55625,0.7234375,0.6765625,0.55625,0.6109375,0.7234375,0.7234375,0.9453125,0.7234375,0.7234375,0.6109375,0.334375,0.28125,0.334375,0.4703125,0.51875,0.334375,0.4453125,0.503125,0.4453125,0.503125,0.4453125,0.4359375,0.5,0.5,0.278125,0.35625,0.50625,0.278125,0.778125,0.5,0.5,0.5046875,0.5,0.340625,0.390625,0.2796875,0.5,0.5,0.7234375,0.5,0.5,0.4453125,0.48125,0.2015625,0.48125,0.5421875],
    avg: 0.5134375
  },
  "Trebuchet MS": {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.3015625,0.3671875,0.325,0.53125,0.525,0.6015625,0.70625,0.1609375,0.3671875,0.3671875,0.3671875,0.525,0.3671875,0.3671875,0.3671875,0.525,0.525,0.525,0.525,0.525,0.525,0.525,0.525,0.525,0.525,0.525,0.3671875,0.3671875,0.525,0.525,0.525,0.3671875,0.771875,0.590625,0.5671875,0.5984375,0.6140625,0.5359375,0.525,0.6765625,0.6546875,0.2796875,0.4765625,0.5765625,0.5078125,0.7109375,0.6390625,0.675,0.5578125,0.7421875,0.5828125,0.48125,0.58125,0.6484375,0.5875,0.853125,0.5578125,0.5703125,0.5515625,0.3671875,0.3578125,0.3671875,0.525,0.53125,0.525,0.5265625,0.5578125,0.4953125,0.5578125,0.546875,0.375,0.503125,0.546875,0.2859375,0.3671875,0.5046875,0.2953125,0.83125,0.546875,0.5375,0.5578125,0.5578125,0.3890625,0.40625,0.396875,0.546875,0.490625,0.7453125,0.5015625,0.49375,0.475,0.3671875,0.525,0.3671875,0.525],
    avg: 0.5085197368421052
  },
  Verdana: {
    widths: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.35,0.39375,0.459375,0.81875,0.6359375,1.0765625,0.759375,0.26875,0.4546875,0.4546875,0.6359375,0.81875,0.3640625,0.4546875,0.3640625,0.4703125,0.6359375,0.6359375,0.6359375,0.6359375,0.6359375,0.6359375,0.6359375,0.6359375,0.6359375,0.6359375,0.4546875,0.4546875,0.81875,0.81875,0.81875,0.546875,1,0.684375,0.6859375,0.6984375,0.771875,0.6328125,0.575,0.7765625,0.7515625,0.421875,0.4546875,0.69375,0.5578125,0.84375,0.7484375,0.7875,0.603125,0.7875,0.7,0.684375,0.6171875,0.7328125,0.684375,0.9890625,0.6859375,0.615625,0.6859375,0.4546875,0.46875,0.4546875,0.81875,0.6421875,0.6359375,0.6015625,0.6234375,0.521875,0.6234375,0.596875,0.384375,0.6234375,0.6328125,0.275,0.3765625,0.5921875,0.275,0.9734375,0.6328125,0.6078125,0.6234375,0.6234375,0.43125,0.521875,0.3953125,0.6328125,0.5921875,0.81875,0.5921875,0.5921875,0.5265625,0.6359375,0.4546875,0.6359375,0.81875],
    avg: 0.6171875000000003
  }
}

// https://developer.mozilla.org/en/docs/Web/CSS/length
// Absolute sizes in pixels for obsolete measurement units.
const absoluteMeasurementUnitsToPixels = {
  mm: 3.8,
  sm: 38,
  pt: 1.33,
  pc: 16,
  in: 96,
  px: 1,
};
const relativeMeasurementUnitsCoef = {
  em: 1,
  ex: 0.5,
};

const coefficients = {
  heightOverlapCoef: 1.05, // Coefficient for height value to prevent overlap.
  lineCapitalCoef: 1.15, // Coefficient for height value. Reserve space for capital chars.
};
const defaultStyle = {
  lineHeight: 1,
  letterSpacing: "0px",
  fontSize: 0,
  angle: 0,
  fontFamily: "",
};

const _degreeToRadian = (angle) => (angle * Math.PI) / 180;

const _getFontData = (fontFamily) => {
  const possibleFonts = fontFamily.split(",").map((f) => f.replace(/'|"/g, ""));
  const fontMatch = possibleFonts.find((f) => fonts[f]) || "Helvetica";
  return fonts[fontMatch];
};

const _splitToLines = (text: string | string[]) => {
  return Array.isArray(text) ? text : text.toString().split(/\r\n|\r|\n/g);
};

const _getSizeWithRotate = (axisSize, dependentSize, angle) => {
  const angleInRadian = _degreeToRadian(angle);
  return (
    Math.abs(Math.cos(angleInRadian) * axisSize) +
    Math.abs(Math.sin(angleInRadian) * dependentSize)
  );
};

/**
 * Convert length-type parameters from specific measurement units to pixels
 * @param  {string} length Css length string value.
 * @param  {number} fontSize Current text font-size.
 * @returns {number} Approximate Css length in pixels.
 */
export const convertLengthToPixels = (
  length: string,
  fontSize?: number,
): number => {
  const attribute = length.match(/[a-zA-Z%]+/)?.[0];
  const value = Number(length.match(/[0-9.,]+/));
  let result;
  if (!attribute) {
    result = value || 0;
  } else if (absoluteMeasurementUnitsToPixels.hasOwnProperty(attribute)) {
    result = value * absoluteMeasurementUnitsToPixels[attribute];
  } else if (relativeMeasurementUnitsCoef.hasOwnProperty(attribute)) {
    result =
      (fontSize ? value * fontSize : value * defaultStyle.fontSize) *
      relativeMeasurementUnitsCoef[attribute];
  } else {
    result = value;
  }
  return result;
};

const _prepareParams = (inputStyle, index) => {
  const lineStyle = Array.isArray(inputStyle) ? inputStyle[index] : inputStyle;
  const style = defaults({}, lineStyle, defaultStyle);
  return assign({}, style, {
    fontFamily: style.fontFamily,
    letterSpacing:
      typeof style.letterSpacing === "number"
        ? style.letterSpacing
        : convertLengthToPixels(String(style.letterSpacing), style.fontSize),
    fontSize:
      typeof style.fontSize === "number"
        ? style.fontSize
        : convertLengthToPixels(String(style.fontSize)),
  });
};

const _approximateTextWidthInternal = (text: string | string[], style) => {
  if (text === undefined || text === "" || text === null) {
    return 0;
  }

  const widths = _splitToLines(text).map((line, index) => {
    const len = line.toString().length;
    const { fontSize, letterSpacing, fontFamily } = _prepareParams(
      style,
      index,
    );
    const fontData = _getFontData(fontFamily);
    const width =
      line
        .toString()
        .split("")
        .map((c) => {
          return c.charCodeAt(0) < fontData.widths.length
            ? fontData.widths[c.charCodeAt(0)]
            : fontData.avg;
        })
        .reduce((cur, acc) => acc + cur, 0) * fontSize;
    return width + letterSpacing * Math.max(len - 1, 0);
  });
  return Math.max(...widths);
};

const _approximateTextHeightInternal = (text: string | string[], style) => {
  if (text === undefined || text === "" || text === null) {
    return 0;
  }
  return _splitToLines(text).reduce((total, line, index) => {
    const lineStyle = _prepareParams(style, index);
    const containsCaps = line.toString().match(/[(A-Z)(0-9)]/);
    const height = containsCaps
      ? lineStyle.fontSize * coefficients.lineCapitalCoef
      : lineStyle.fontSize;
    return total + lineStyle.lineHeight * height;
  }, 0);
};

const _approximateDimensionsInternal = (
  text: string | string[],
  style?: TextSizeStyleInterface,
) => {
  const angle = Array.isArray(style)
    ? style[0] && style[0].angle
    : style && style.angle;
  const height = _approximateTextHeightInternal(text, style);
  const width = _approximateTextWidthInternal(text, style);
  const widthWithRotate = angle
    ? _getSizeWithRotate(width, height, angle)
    : width;
  const heightWithRotate = angle
    ? _getSizeWithRotate(height, width, angle)
    : height;
  return {
    width: widthWithRotate,
    height: heightWithRotate * coefficients.heightOverlapCoef,
  };
};

const _getMeasurementContainer = memoize(() => {
  const element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  element.setAttribute("xlink", "http://www.w3.org/1999/xlink");

  const containerElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text",
  );
  element.appendChild(containerElement);

  element.style.position = "fixed";
  element.style.top = "-9999px";
  element.style.left = "-9999px";

  document.body.appendChild(element);

  return containerElement;
});

const styleToKeyComponent = (style) => {
  if (!style) {
    return "null";
  }

  return `${style.angle}:${style.fontFamily}:${style.fontSize}:${style.letterSpacing}:${style.lineHeight}`;
};

const _measureDimensionsInternal = memoize(
  (text: string | string[], style?: TextSizeStyleInterface) => {
    const containerElement = _getMeasurementContainer();

    const lines = _splitToLines(text);
    let heightAcc = 0;
    for (const [i, line] of lines.entries()) {
      const textElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "tspan",
      );
      const params = _prepareParams(style, i);
      textElement.style.fontFamily = params.fontFamily;
      textElement.style.transform = `rotate(${params.angle})`;
      textElement.style.fontSize = `${params.fontSize}px`;
      textElement.style.lineHeight = params.lineHeight;
      textElement.style.fontFamily = params.fontFamily;
      textElement.style.letterSpacing = params.letterSpacing;
      textElement.textContent = line;
      textElement.setAttribute("x", "0");
      textElement.setAttribute("y", `${heightAcc}`);
      heightAcc += params.lineHeight * params.fontSize;

      containerElement.appendChild(textElement);
    }

    const { width, height } = containerElement.getBoundingClientRect();

    containerElement.innerHTML = "";

    return { width, height };
  },
  (text, style) => {
    const totalText = Array.isArray(text) ? text.join() : text;
    const totalStyle = Array.isArray(style)
      ? style.map(styleToKeyComponent).join()
      : styleToKeyComponent(style);
    return `${totalText}::${totalStyle}`;
  },
);

export interface TextSizeStyleInterface {
  angle?: number;
  fontFamily?: string;
  fontSize?: number | string;
  letterSpacing?: string;
  lineHeight?: number;
}

// Stubbable implementation.
export const _approximateTextSizeInternal = {
  impl: (
    text: string | string[],
    style?: TextSizeStyleInterface,
    __debugForceApproximate = false,
  ) => {
    // Attempt to first measure the element in DOM. If there is no DOM, fallback
    // to the less accurate approximation algorithm.
    const isClient =
      typeof window !== "undefined" &&
      typeof window.document !== "undefined" &&
      typeof window.document.createElement !== "undefined";

    if (!isClient || __debugForceApproximate) {
      return _approximateDimensionsInternal(text, style);
    }

    return _measureDimensionsInternal(text, style);
  },
};

/**
 * Predict text size by font params.
 * @param {string|string[]} text Content for width calculation.
 * @param {Object} style Text styles, ,fontFamily, fontSize, etc.
 * @param {string} style.fontFamily Text fontFamily.
 * @param {(number|string)} style.fontSize Text fontSize.
 * @param {number} style.angle Text rotate angle.
 * @param {string} style.letterSpacing Text letterSpacing(space between letters).
 * @param {number} style.lineHeight Line height coefficient.
 * @returns {number} Approximate text label height.
 */
export const approximateTextSize = (
  text: string | string[],
  style?: TextSizeStyleInterface,
): { width: number; height: number } =>
  _approximateTextSizeInternal.impl(text, style);
