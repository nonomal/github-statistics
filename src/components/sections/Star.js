import React from 'react'
import PropTypes from 'prop-types'

import { Row, Statistic, Icon, Tag } from 'antd'
// import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip as ChartToolTip } from 'recharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import COLORS from './Colors'
import OPTIONS from './ChartOptions'


class Star extends React.Component {
  static formatter = (repo, data) => {
    // star total data, index 0
    let total = { name: repo, data: [] }
    // star  daily increment data, index 1
    let increment = { name: repo, data: [] }

    let cumulativeCount = 0
    data.forEach((value, key) => {
      cumulativeCount += value
      total.data.push([key, cumulativeCount])
      increment.data.push([key, value])
    })

    return [total, increment]
  }

  shouldComponentUpdate(nextProps) {
    return !nextProps.loading && !Array.from(nextProps.ready.values()).includes(false)
  }

  _renderStatistics = () => {
    const { stats, ready } = this.props

    return (
      <>
      {Array.from(stats.entries()).map((
        (pair, index) => {
          if (ready.get(pair[0])) {
            const { total, maxIncrement, createdAt } = pair[1]
            const dateSinceCreated = Math.floor((Date.now() - new Date(createdAt).valueOf()) / (24*60*60*1000))
            const averagePerDay = total / dateSinceCreated
            return (
              <div key={`star-statistics-${pair[0]}`}>
                <Row>
                  <Tag color={COLORS[index]}>
                    {pair[0]}
                  </Tag>
                  <Row type="flex" align="middle" justify="space-between">
                    <span className="stats-card">
                      <Statistic title="Total stars" value={total} prefix={<Icon type="star" />} />
                    </span>
                    <span className="stats-card">
                      <Statistic title="Avg. stars/day" value={averagePerDay} precision={2} />
                    </span>
                    <span className="stats-card">
                      <Statistic title="Max. stars/day" value={maxIncrement} />
                    </span>
                  </Row>
                </Row>
              </div>
            )
          }
          return false
        }
      ))}
      </>
    )
  }

  _renderCharts = () => {
    const { data, ready } = this.props

    if (!Array.from(ready.values()).includes(true)) return

    return (
      <>
      <HighchartsReact
        highcharts={Highcharts}
        options={{ ...OPTIONS,
          chart: {
            type: 'line',
            zoomType: 'x',
          },
          xAxis: {
            type: 'datetime',
          },
          yAxis: {
            gridLineWidth: 0,
            title: {
              text: 'total stars',
            },
          },
          series: Array.from(data.values()).map(dataArray => dataArray[0]),
        }}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={{ ...OPTIONS,
          chart: {
            type: 'column',
            zoomType: 'x',
          },
          xAxis: {
            type: 'datetime',
          },
          yAxis: {
            gridLineWidth: 0,
            title: {
              text: 'star increment/day',
            },
          },
          series: Array.from(data.values()).map(dataArray => dataArray[1]),
        }}
      />
      </>
    )
  }

  // _renderLines = (dataIndex) => {
  //   const { data, ready } = this.props
  //   const dataReady = Array.from(ready.values())
  //   console.log("Lines are rendered")
  //   return Array.from(data.values()).map((dataArray, index) => (
  //     dataReady[index]
  //       ?
  //       <Line
  //         type="monotone"
  //         key={`star-chart-total-${dataArray[dataIndex].name}`}
  //         data={dataArray[dataIndex].data}
  //         dataKey="value"
  //         name={dataArray[dataIndex].name}
  //         stroke={COLORS[index]}
  //         dot={false}
  //       />
  //       :
  //     <></>
  //   ))
  // }

  // _renderCharts = () => {
  //   const { ready } = this.props

  //   if (!Array.from(ready.values()).includes(true)) return

  //   return (
  //     <>
  //     <Row>
  //       <div>
  //         <ResponsiveContainer width="100%" height={300}>
  //           <LineChart>
  //             <CartesianGrid stroke="#ccc" strokeDasharray="2 7" />
  //             <Legend verticalAlign="top"/>
  //             <XAxis
  //               dataKey="timestamp"
  //               scale="time"
  //               allowDuplicatedCategory={false}
  //               type="number"
  //               domain = {['auto', 'auto']}
  //               tickFormatter={ms => new Date(ms).toISOString().slice(0,10)}
  //             />
  //             <YAxis dataKey="value" label={{ value: 'total stars', angle: -90, position: 'insideBottomLeft' }}/>
  //             <ChartToolTip labelFormatter={ms => new Date(ms).toISOString().slice(0,10)}/>
  //             {this._renderLines(0)}
  //           </LineChart>
  //         </ResponsiveContainer>
  //       </div>
  //       <div>
  //         <ResponsiveContainer width="100%" height={300}>
  //           <LineChart>
  //             <CartesianGrid stroke="#ccc" strokeDasharray="2 7" />
  //             <Legend verticalAlign="top"/>
  //             <XAxis
  //               dataKey="timestamp"
  //               scale="time"
  //               allowDuplicatedCategory={false}
  //               type="number"
  //               domain = {['auto', 'auto']}
  //               tickFormatter={ms => new Date(ms).toISOString().slice(0,10)}
  //             />
  //             <YAxis dataKey="value" label={{ value: 'daily increment', angle: -90, position: 'insideBottomLeft' }}/>
  //             <ChartToolTip labelFormatter={ms => new Date(ms).toISOString().slice(0,10)}/>
  //             {this._renderLines(1)}
  //           </LineChart>
  //         </ResponsiveContainer>
  //       </div>
  //     </Row>
  //     </>
  //   )
  // }

  render() {
    return (
      <>
      {this._renderStatistics()}
      {this._renderCharts()}
      </>
    )
  }
}

Star.propTypes = {
  id: PropTypes.string,
  repos: PropTypes.array,
  data: PropTypes.objectOf(Map),
  stats: PropTypes.objectOf(Map),
  ready: PropTypes.objectOf(Map),
  loading: PropTypes.bool,
}


export default Star