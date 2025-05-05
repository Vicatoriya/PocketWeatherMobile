import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { LineChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import {
  Circle,
  G,
  Line,
  Text as SVGText,
  ForeignObject,
  Defs,
  Filter,
  FeGaussianBlur,
} from 'react-native-svg';

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
  if (!Array.isArray(forecast)) return null;

  const maxTemps = forecast.map((day) => day.day.maxtemp_c);
  const minTemps = forecast.map((day) => day.day.mintemp_c);
  const dates = forecast.map((day) => day.date.slice(5));

  const allTemps = [...maxTemps, ...minTemps];
  const yMin = Math.floor(Math.min(...allTemps)) - 1;
  const yMax = Math.ceil(Math.max(...allTemps)) + 1;
  const chartWidth = Math.max(SCREEN_WIDTH, forecast.length * 70);

  const CombinedLinesAndLabels = ({ x, y }: any) => (
    <G>
      <Defs>
        <Filter id="glow">
          <FeGaussianBlur stdDeviation="2" result="blur" />
        </Filter>
      </Defs>

      {maxTemps.map((_, i) =>
        i === 0 ? null : (
          <Line
            key={`max-line-${i}`}
            x1={x(i - 1)}
            y1={y(maxTemps[i - 1])}
            x2={x(i)}
            y2={y(maxTemps[i])}
            stroke="white"
            strokeWidth={2}
            filter="url(#glow)"
          />
        ),
      )}

      {minTemps.map((_, i) =>
        i === 0 ? null : (
          <Line
            key={`min-line-${i}`}
            x1={x(i - 1)}
            y1={y(minTemps[i - 1])}
            x2={x(i)}
            y2={y(minTemps[i])}
            stroke="white"
            strokeWidth={2}
            filter="url(#glow)"
          />
        ),
      )}

      {forecast.map((day, index) => {
        const max = day.day.maxtemp_c;
        const min = day.day.mintemp_c;
        const iconUrl = `https:${day.day.condition.icon}`;

        return (
          <G key={index}>
            <Circle
              cx={x(index)}
              cy={y(max)}
              r={4}
              stroke="white"
              fill="white"
            />
            <SVGText
              x={x(index)}
              y={y(max) - 12}
              fontSize={14}
              fill="white"
              fontWeight="bold"
              alignmentBaseline="middle"
              textAnchor="middle"
            >
              {Math.round(max)}°
            </SVGText>

            <Circle
              cx={x(index)}
              cy={y(min)}
              r={4}
              stroke="white"
              fill="white"
            />
            <SVGText
              x={x(index)}
              y={y(min) + 16}
              fontSize={14}
              fill="white"
              fontWeight="bold"
              alignmentBaseline="middle"
              textAnchor="middle"
            >
              {Math.round(min)}°
            </SVGText>

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

            <SVGText
              x={x(index)}
              y={y(yMin) + 44}
              fontSize={13}
              fill="white"
              fontWeight="500"
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
    <>
      <Text style={styles.sectionTitle}>Прогноз на неделю</Text>
      <View style={styles.card}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            style={{ height: 260, width: chartWidth }}
            data={maxTemps}
            svg={{ stroke: 'transparent' }}
            contentInset={{ top: 5, bottom: 50, left: 20, right: 20 }}
            curve={shape.curveLinear}
            yMin={yMin}
            yMax={yMax}
          >
            <CombinedLinesAndLabels />
          </LineChart>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#fff',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 5,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default ForecastChart;
