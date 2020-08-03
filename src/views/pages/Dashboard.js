import React, { Component } from 'react';
import reactFeature from '../../assets/images/react-feature.svg';
import sassFeature from '../../assets/images/sass-feature.svg';
import bootstrapFeature from '../../assets/images/bootstrap-feature.svg';
import responsiveFeature from '../../assets/images/responsive-feature.svg';
import Clock from 'react-live-clock';
import {fetchCpuUsage, fetchMemoryUsage, fetchConnectionsCount, fetchDiskSpace} from '../../vibe/components/Fetcher'
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Progress,
  Button
} from 'reactstrap';

type state_types = {
  serverUsage: Array<*>,
  serverMemoryUsage: String,
  gatewayUsage: Array<*>,
  gatewayMemoryUsage: String,
  serverConnectionCount: Array<*>,
  gatewayConnectionCount: Array<*>,
  serverDiskSpace: Array<*>,
  gatewayDiskSpace: Array<*>
};

class Dashboard extends React.Component<props_types, state_types> {

  constructor(props: props_types) {
    super(props);
    this.state = {
      serverUsage:[],
      serverMemoryUsage:"",
      gatewayUsage:[],
      gatewayMemoryUsage:"",
      serverConnectionCount:[],
      gatewayConnectionCount:[],
      gatewayDiskSpace:[],
      serverDiskSpace:[]
    };
  }


  componentDidMount(){
    this.loadData()
    setInterval(this.loadData.bind(this), 3000);
    

  }

  async loadData() {
    fetchCpuUsage("Server", su => {
      //console.log("[*] GOT SERVER CPU USAGE: ");
      //console.log(su);
      this.setState({
          serverUsage: su
      });
    });

    fetchMemoryUsage("Server", smu => {
      //console.log("[*] GOT SERVER MEMORY USAGE: ");
      //console.log(smu);
      this.setState({
        serverMemoryUsage: smu
      });
    });

    fetchCpuUsage("Gateway", gu => {
      //console.log("[*] GOT GATEWAY CPU USAGE: ");
      //console.log(gu);
      this.setState({
          gatewayUsage: gu
      });
    });

    fetchMemoryUsage("Gateway", gmu => {
      //console.log("[*] GOT GATEWAY MEMORY USAGE: ");
      //console.log(gmu);
      this.setState({
        gatewayMemoryUsage: gmu
      });
    });

    fetchConnectionsCount("Server", scc => {
      //console.log("[*] GOT SERVER CONNECTION COUNT: ");
      //console.log(scc);
      this.setState({
        serverConnectionCount: scc
      });
    });

    fetchConnectionsCount("Gateway", gcc => {
      //console.log("[*] GOT GATEWAY CONNECTION COUNT: ");
      //console.log(gcc);
      this.setState({
        gatewayConnectionCount: gcc
      });
    });

    fetchDiskSpace("Server", sds => {
      //console.log("[*] GOT SERVER DISK SPACE: ");
      //console.log(sds);
      this.setState({
        serverDiskSpace: sds
      });
    });

    fetchDiskSpace("Gateway", gds => {
      //console.log("[*] GOT GATEWAY DISK SPACE: ");
      //console.log(gds);
      this.setState({
        gatewayDiskSpace: gds
      });
    });
    
 }

  render() {

    if(!this.state.serverUsage || !this.state.serverMemoryUsage || this.state.serverUsage === [] || this.state.serverMemoryUsage === "")
      return null;

    if(!this.state.gatewayUsage || !this.state.gatewayMemoryUsage || this.state.gatewayUsage === [] || this.state.gatewayMemoryUsage === "")
      return null;

    if(!this.state.serverConnectionCount || !this.state.gatewayConnectionCount || this.state.serverConnectionCount === [] || this.state.gatewayConnectionCount === [])
      return null;

    if(!this.state.serverDiskSpace || !this.state.gatewayDiskSpace || this.state.serverDiskSpace === [] || this.state.gatewayDiskSpace === [] || !this.state.serverDiskSpace[0] || !this.state.gatewayDiskSpace[0])
      return null;
    
    const heroStyles = {
      padding: '50px 0 70px',
      color: "black"
    };

    const chartColors = {
      red: 'rgb(233, 30, 99)',
      darkRed: 'rgb(200, 20, 80)',
      danger: 'rgb(233, 30, 99)',
      dangerTransparent: 'rgba(233, 30, 99, .8)',
      orange: 'rgb(255, 159, 64)',
      yellow: 'rgb(255, 180, 0)',
      green: 'rgb(34, 182, 110)',
      darkGreen: 'rgb(20, 160, 80)',
      blue: 'rgb(68, 159, 238)',
      primary: 'rgb(68, 159, 238)',
      primaryTransparent: 'rgba(68, 159, 238, .8)',
      purple: 'rgb(153, 102, 255)',
      grey: 'rgb(201, 203, 207)',

      primaryShade1: 'rgb(68, 159, 238)',
      primaryShade2: 'rgb(23, 139, 234)',
      primaryShade3: 'rgb(14, 117, 202)',
      primaryShade4: 'rgb(9, 85, 148)',
      primaryShade5: 'rgb(12, 70, 117)'
    };

    var serverFreeRam = this.state.serverMemoryUsage[3];
    var serverUsedRam = this.state.serverMemoryUsage[0][9];


    const serverRamData = {
      labels: ['Free', 'Used'],
      datasets: [
        {
          data: [serverFreeRam, serverUsedRam],
          backgroundColor: [
            chartColors.green,
            chartColors.red
          ],
          hoverBackgroundColor: [
            chartColors.darkGreen,
            chartColors.darkRed
          ]
        }
      ]
    };

    var gatewayFreeRam = this.state.gatewayMemoryUsage[3];
    var gatewayUsedRam = this.state.gatewayMemoryUsage[0][9];


    const gatewayRamData = {
      labels: ['Free', 'Used'],
      datasets: [
        {
          data: [gatewayFreeRam, gatewayUsedRam],
          backgroundColor: [
            chartColors.green,
            chartColors.red
          ],
          hoverBackgroundColor: [
            chartColors.darkGreen,
            chartColors.darkRed
          ]
        }
      ]
    };

    var serverCpuUsageData = {
      data: {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        datasets: [
          {
            label: 'Usage',
            data: this.state.serverUsage[0],
            borderColor: 'transparent',
            backgroundColor: chartColors.primary,
            pointBackgroundColor: 'rgba(0,0,0,0)',
            pointBorderColor: 'rgba(0,0,0,0)',
            borderWidth: 4
          }
        ]
      }
    };
    var serverCpuUsage15Data = {
      data: {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        datasets: [
          {
            label: 'Usage',
            data: this.state.serverUsage[2],
            borderColor: 'transparent',
            backgroundColor: chartColors.primary,
            pointBackgroundColor: 'rgba(0,0,0,0)',
            pointBorderColor: 'rgba(0,0,0,0)',
            borderWidth: 4
          }
        ]
      }
    };

    var gatewayCpuUsageData = {
      data: {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        datasets: [
          {
            label: 'Usage',
            data: this.state.gatewayUsage[0],
            borderColor: 'transparent',
            backgroundColor: chartColors.primary,
            pointBackgroundColor: 'rgba(0,0,0,0)',
            pointBorderColor: 'rgba(0,0,0,0)',
            borderWidth: 4
          }
        ]
      }
    };
    var gatewayCpuUsage15Data = {
      data: {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        datasets: [
          {
            label: 'Usage',
            data: this.state.gatewayUsage[2],
            borderColor: 'transparent',
            backgroundColor: chartColors.primary,
            pointBackgroundColor: 'rgba(0,0,0,0)',
            pointBorderColor: 'rgba(0,0,0,0)',
            borderWidth: 4
          }
        ]
      }
    };

    var graphOptions ={
      options: {
        scales: {
          xAxes: [
            {
              display: false
            }
          ],
          yAxes: [
            {
              display: true,
              tick: {
                min: 0,
                max: 5
              }
            }
          ]
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    };

    var serverConnectionNumberPercentage = this.state.serverConnectionCount[39]*100/500;
    var gatewayConnectionNumberPercentage = this.state.gatewayConnectionCount[39]*100/2000;
    var down = "fa fa-caret-down text-success"
    var up = "fa fa-caret-up text-danger"
    var serverCCtrend = up;
    var gatewayCCtrend = up;
    const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length-1
    if(this.state.serverConnectionCount[39] < arrAvg(this.state.serverConnectionCount)) {
      serverCCtrend = down;
    }
    //console.log("Server AVG " + arrAvg(this.state.serverConnectionCount) + " last is " + this.state.serverConnectionCount[39])
    if(this.state.gatewayConnectionCount[39] < arrAvg(this.state.gatewayConnectionCount)) {
      gatewayCCtrend = down;
    }
    //console.log("Gateway AVG " + arrAvg(this.state.gatewayConnectionCount) + " last is " + this.state.gatewayConnectionCount[39])


    var splittedGWDiskSpace = this.state.gatewayDiskSpace[0].split(" ");
    if(splittedGWDiskSpace.length < 4) {
      splittedGWDiskSpace = "0 0 0 0 0 0".split("");
    }
    var splittedSDiskSpace = this.state.serverDiskSpace[0].split(" ");
    if(splittedSDiskSpace.length < 4) {
      splittedSDiskSpace = "0 0 0 0 0 0".split("");
    }

    return (
      
      <div>
        <div className="m-b">
          <h1 >ITA: <Clock format={'HH:mm:ss'} ticking={true} />  DET: <Clock format={'HH:mm:ss'} ticking={true} timezone={'US/Pacific'} /></h1>
        </div>
        <Row>
        <Col md={3} xs={12}>
            <Card>
              <CardHeader>
                Total server connections (out of 500){' '}
              </CardHeader>
              <CardBody>
                <h2 className="m-b-20 inline-block">
                  <span>{this.state.serverConnectionCount[39]+""}</span>
                </h2>{' '}
                <i
                  className={serverCCtrend}
                  aria-hidden="true"
                />
                <Progress value={Math.ceil(serverConnectionNumberPercentage)} color="primary" />
              </CardBody>
            </Card>
          </Col>
          <Col md={3} xs={12}>
            <Card>
              <CardHeader>
                Used server disk space (max {splittedSDiskSpace[1]}){' '}
              </CardHeader>
              <CardBody>
                <h2 className="m-b-20 inline-block">
                  <span>{splittedSDiskSpace[2]}</span>
                </h2>
                <Progress value={splittedSDiskSpace[4].replace("%","")} color="success" />
              </CardBody>
            </Card>
          </Col>
          <Col md={3} xs={12}>
            <Card>
              <CardHeader>
              Total gateway connections (out of 2000){' '}
              </CardHeader>
              <CardBody>
                <h2 className="inline-block">
                  <span>{this.state.gatewayConnectionCount[39]+""}</span>
                </h2>{' '}
                <i className={gatewayCCtrend} aria-hidden="true" />
                <Progress value={Math.ceil(gatewayConnectionNumberPercentage)} color="primary" />
              </CardBody>
            </Card>
          </Col>
          <Col md={3} xs={12}>
            <Card>
              <CardHeader>
                Used gateway disk space (max {splittedGWDiskSpace[1]}){' '}
              </CardHeader>
              <CardBody>
                <h2 className="inline-block">
                  <span>{splittedGWDiskSpace[2]}</span>
                </h2>
                <Progress value={splittedGWDiskSpace[4].replace("%","")} color="success" />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
        <Col md={4} sm={12}>
            <Card>
              <CardHeader>Server CPU Usage 1min</CardHeader>
              <CardBody>
                <div className="full-bleed">
                  <Line
                    data={serverCpuUsageData.data}
                    width={1200}
                    height={500}
                    legend={{ display: false }}
                    options={graphOptions.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={4} sm={12}>
            <Card>
              <CardHeader>Server CPU Usage 15min</CardHeader>
              <CardBody>
                <div className="full-bleed">
                  <Line
                    data={serverCpuUsage15Data.data}
                    width={1200}
                    height={500}
                    legend={{ display: false }}
                    options={graphOptions.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={4} sm={12}>
            <Card>
              <CardHeader>Server RAM usage</CardHeader>
              <CardBody>
                <Doughnut
                  data={serverRamData}
                  width={1200}
                  height={450}
                  legend={{ display: false }}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
        <Col md={4} sm={12}>
            <Card>
              <CardHeader>Gateway CPU Usage 1min</CardHeader>
              <CardBody>
                <div className="full-bleed">
                  <Line
                    data={gatewayCpuUsageData.data}
                    width={1200}
                    height={500}
                    legend={{ display: false }}
                    options={graphOptions.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={4} sm={12}>
            <Card>
              <CardHeader>Gateway CPU Usage 15min</CardHeader>
              <CardBody>
                <div className="full-bleed">
                  <Line
                    data={gatewayCpuUsage15Data.data}
                    width={1200}
                    height={500}
                    legend={{ display: false }}
                    options={graphOptions.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={4} sm={12}>
            <Card>
              <CardHeader>Gateway RAM Usage</CardHeader>
              <CardBody>
                <Doughnut
                  data={gatewayRamData}
                  width={1200}
                  height={450}
                  legend={{ display: false }}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>



        {/*
        <Row>
          <Col md={6}>
            <Card>
              <CardBody className="display-flex">
                <img
                  src={reactFeature}
                  style={{ width: 70, height: 70 }}
                  alt="react.js"
                  aria-hidden={true}
                />
                <div className="m-l">
                  <h2 className="h4">React.js</h2>
                  <p className="text-muted">
                    Built to quickly get your MVPs off the ground.
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <CardBody className="display-flex">
                <img
                  src={bootstrapFeature}
                  style={{ width: 70, height: 70 }}
                  alt="Bootstrap"
                  aria-hidden={true}
                />
                <div className="m-l">
                  <h2 className="h4">Bootstrap 4</h2>
                  <p className="text-muted">
                    The most popular framework to get your layouts built.
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Card>
              <CardBody className="display-flex">
                <img
                  src={sassFeature}
                  style={{ width: 70, height: 70 }}
                  alt="Sass"
                  aria-hidden={true}
                />
                <div className="m-l">
                  <h2 className="h4">Sass</h2>
                  <p className="text-muted">
                    Easily change the design system styles to fit your needs.
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <CardBody className="display-flex">
                <img
                  src={responsiveFeature}
                  style={{ width: 70, height: 70 }}
                  alt="Responsive"
                  aria-hidden={true}
                />
                <div className="m-l">
                  <h2 className="h4">Responsive</h2>
                  <p className="text-muted">
                    Designed for screens of all sizes.
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        */}
      </div>
    );
  }
}

export default Dashboard;
