import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { LineChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { Circle, G, Line, Text as SVGText, ForeignObject } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: {
      icon: string;
    };
  };
}

const ForecastChart = ({ forecast }: { forecast: ForecastDay[] }) => {
  if (!Array.isArray(forecast)) {
    return <Text style={styles.error}>Нет данных для отображения графика</Text>;
  }

  const maxTemps = forecast.map(day => day.day.maxtemp_c);
  const minTemps = forecast.map(day => day.day.mintemp_c);
  const dates = forecast.map(day => day.date.slice(5));

  const allTemps = [...maxTemps, ...minTemps];
  const yMin = Math.floor(Math.min(...allTemps)) - 1;
  const yMax = Math.ceil(Math.max(...allTemps)) + 1;
  const chartWidth = Math.max(SCREEN_WIDTH, forecast.length * 60);

  const CombinedLinesAndLabels = ({ x, y }: any) => (
    <G>
      {/* Линии max */}
      {maxTemps.map((_, i) => {
        if (i === 0) return null;
        return (
          <Line
            key={`max-line-${i}`}
            x1={x(i - 1)}
            y1={y(maxTemps[i - 1])}
            x2={x(i)}
            y2={y(maxTemps[i])}
            stroke="#f97316"
            strokeWidth={2}
          />
        );
      })}

      {/* Линии min */}
      {minTemps.map((_, i) => {
        if (i === 0) return null;
        return (
          <Line
            key={`min-line-${i}`}
            x1={x(i - 1)}
            y1={y(minTemps[i - 1])}
            x2={x(i)}
            y2={y(minTemps[i])}
            stroke="#0891b2"
            strokeWidth={2}
          />
        );
      })}

      {/* Точки, иконки и подписи */}
      {forecast.map((day, index) => {
        const max = day.day.maxtemp_c;
        const min = day.day.mintemp_c;
        const iconUrl = `https:${day.day.condition.icon}`;

        return (
          <G key={index}>
            {/* Max temp */}
            <Circle cx={x(index)} cy={y(max)} r={4} stroke="#f97316" fill="white" />
            <SVGText
              x={x(index)}
              y={y(max) - 10}
              fontSize={12}
              fill="#f97316"
              alignmentBaseline="middle"
              textAnchor="middle"
            >
              {Math.round(max)}°
            </SVGText>

            {/* Min temp */}
            <Circle cx={x(index)} cy={y(min)} r={4} stroke="#0891b2" fill="white" />
            <SVGText
              x={x(index)}
              y={y(min) + 14}
              fontSize={12}
              fill="#0e7490"
              alignmentBaseline="middle"
              textAnchor="middle"
            >
              {Math.round(min)}°
            </SVGText>

            {/* Weather icon */}
            <ForeignObject
              x={x(index) - 16}
              y={y(yMin) + 5}
              width={32}
              height={32}
            >
              <Image
                source={{ uri: iconUrl }}
                style={{ width: 32, height: 32 }}
              />
            </ForeignObject>

            {/* Date */}
            <SVGText
              x={x(index)}
              y={y(yMin) + 42}
              fontSize={12}
              fill="#475569"
              alignmentBaseline="middle"
              textAnchor="middle"
            >
              {dates[index]}
            </SVGText>
          </G>
        );
      })}
    </G>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Прогноз на неделю</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <LineChart
            style={{ height: 260, width: chartWidth }}
            data={maxTemps} // неважно, т.к. линии отрисовываются вручную
            svg={{ stroke: 'transparent' }}
            contentInset={{ top: 15, bottom: 50, left: 15, right: 15}}
            curve={shape.curveLinear}
            yMin={yMin}
            yMax={yMax}
          >
            <CombinedLinesAndLabels />
          </LineChart>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#0f172a',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ForecastChart;
