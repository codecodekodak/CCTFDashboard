import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Button, Badge, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Header, SidebarNav, Footer, PageContent, Avatar, Chat, PageAlert, Page } from '../vibe';
import Logo from '../assets/images/vibe-logo.svg';
import nav from '../_nav';
import routes from '../views';
import ContextProviders from '../vibe/components/utilities/ContextProviders';
import handleKeyAccessibility, { handleClickAccessibility } from '../vibe/helpers/handleTabAccessibility';
import {fetchLastUpdate, fetchMemoryUsage, fetchCpuUsage, fetchApacheStatus} from '../vibe/components/Fetcher'


const MOBILE_SIZE = 992;

type state_types = {
  lastServerUpdate: Number,
  lastGatewayUpdate: Number,
  serverUsage: Array<*>,
  serverMemoryUsage: String,
  gatewayUsage: Array<*>,
  gatewayMemoryUsage: String,
  serverApacheStatus:String,
  gatewayApacheStatus:String
}

var gatewayStatus="";
var serverStatus="";

export default class DashboardLayout extends Component<props_types, state_types> {
  constructor(props:props_types) {
    super(props);
    this.state = {
      sidebarCollapsed: false,
      isMobile: window.innerWidth <= MOBILE_SIZE,
      showChat1: true,
      serverUsage:[],
      serverMemoryUsage:"",
      gatewayUsage:[],
      gatewayMemoryUsage:"",
      serverApacheStatus:"",
      gatewayApacheStatus:""
    };
  }

  handleResize = () => {
    if (window.innerWidth <= MOBILE_SIZE) {
      this.setState({ sidebarCollapsed: false, isMobile: true });
    } else {
      this.setState({ isMobile: false });
    }
  };

  componentDidUpdate(prev) {
    if (this.state.isMobile && prev.location.pathname !== this.props.location.pathname) {
      this.toggleSideCollapse();
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('keydown', handleKeyAccessibility);
    document.addEventListener('click', handleClickAccessibility);

    this.loadData()
    setInterval(this.loadData.bind(this), 3000);
  }

  async loadData() {
    fetchLastUpdate("Server", su => {
      //console.log("[*] GOT LAST SERVER UPDATE: ");
      //console.log(su);
      this.setState({
          lastServerUpdate: parseInt(su)
      });
    });

    fetchLastUpdate("Gateway", gu => {
      //console.log("[*] GOT LAST GATEWAY UPDATE: ");
      //console.log(gu);
      this.setState({
          lastGatewayUpdate: parseInt(gu)
      });
    });


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

    fetchApacheStatus("Server", sas => {
      console.log("[*] GOT SERVER APACHE STATUS: ");
      console.log(sas);
      this.setState({
        serverApacheStatus: sas
      });
    });


    fetchApacheStatus("Gateway", gas => {
      console.log("[*] GOT GATEWAY APACHE STATUS: ");
      console.log(gas);
      this.setState({
        gatewayApacheStatus: gas
      });
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  toggleSideCollapse = () => {
    this.setState(prevState => ({ sidebarCollapsed: !prevState.sidebarCollapsed }));
  };

  closeChat = () => {
    this.setState({ showChat1: false });
  };

  render() {
    if(!this.state.serverUsage || !this.state.serverMemoryUsage || this.state.serverUsage === [] || this.state.serverMemoryUsage === "" || !this.state.serverUsage[0])
      return null;

    if(!this.state.gatewayUsage || !this.state.gatewayMemoryUsage || this.state.gatewayUsage === [] || this.state.gatewayMemoryUsage === "" || !this.state.gatewayUsage[0])
      return null;
    
    if(!this.state.serverApacheStatus || !this.state.gatewayApacheStatus || this.state.serverApacheStatus === "" || this.state.gatewayApacheStatus === "")
      return null;

    const { sidebarCollapsed } = this.state;
    const sidebarCollapsedClass = sidebarCollapsed ? 'side-menu-collapsed' : '';

    var up = "fa fa-check-circle text-success p-2";
    var warning = "fa fa-question-circle text-warning p-2";
    var down = "fa fa-times-circle text-danger p-2";
    var date = new Date();
    var now = Math.ceil(date.getTime()/1000);
    serverStatus = up;
    gatewayStatus = up;

    if(now - this.state.lastServerUpdate > 7) {
      serverStatus = warning;
      if(now - this.state.lastServerUpdate > 17) {
        serverStatus = down;
      }
    }

    if(now - this.state.lastGatewayUpdate > 7) {
      gatewayStatus = warning;
      if(now - this.state.lastGatewayUpdate > 17) {
        gatewayStatus = down;
      }
    }

    var apacheOk = "fa fa-internet-explorer text-success p-2";
    var apacheWarning = "fa fa-internet-explorer text-warning p-2";
    var apacheDown = "fa fa-internet-explorer text-danger p-2";
    var apacheBlack = "fa fa-internet-explorer p-2";
    var apacheServerStatus = apacheOk
    var apacheGatewayStatus = apacheOk

    if(this.state.serverApacheStatus === "fail" || this.state.serverApacheStatus === "0") {
      apacheServerStatus = apacheDown;
    }
    if(this.state.serverApacheStatus === "bad") {
      apacheServerStatus = apacheWarning;
    }
    if(this.state.serverApacheStatus === "meh") {
      apacheServerStatus = apacheBlack;
    }
    if(this.state.gatewayApacheStatus === "fail" || this.state.gatewayApacheStatus === "0") {
      apacheGatewayStatus = apacheDown;
    }
    if(this.state.gatewayApacheStatus === "bad") {
      apacheGatewayStatus = apacheWarning;
    }
    if(this.state.gatewayApacheStatus === "meh") {
      apacheGatewayStatus = apacheBlack;
    }


    return (
      <ContextProviders>
        <div className={`app ${sidebarCollapsedClass}`}>
          <PageAlert />
          <div className="app-body">
            <SidebarNav
              nav={nav}
              logo={Logo}
              logoText="CCTF Group 3"
              isSidebarCollapsed={sidebarCollapsed}
              toggleSidebar={this.toggleSideCollapse}
              {...this.props}
            />
            <Page>
            <Header
                toggleSidebar={this.toggleSideCollapse}
                isSidebarCollapsed={sidebarCollapsed}
                routes={routes}
                {...this.props}>
                <React.Fragment>
                  <span className="bold p-2">SERVER </span>
                  <i className={serverStatus} style={{fontSize: "18pt"}} aria-hidden="true" />
                  <i className={apacheServerStatus} style={{fontSize: "18pt"}} aria-hidden="true"/>
                  <i className="fa fa-microchip p-2" style={{fontSize: "17pt"}} aria-hidden="true"/>
                  <span className="bold pt-2 pb-2">{this.state.serverUsage[0][this.state.serverUsage.length-1]} </span>
                  <i className="fa fa-database p-2 pl-3"style={{fontSize: "16pt"}} aria-hidden="true"/>
                  <span className="bold pt-2 pb-2">{this.state.serverMemoryUsage[0][this.state.serverMemoryUsage[0].length-1] +"mb/" +this.state.serverMemoryUsage[1] +"mb"} </span>

                  <span className="bold p-2 ml-3">GATEWAY </span>
                  <i className={gatewayStatus} style={{fontSize: "18pt"}} aria-hidden="true" />
                  <i className={apacheGatewayStatus} style={{fontSize: "18pt"}} aria-hidden="true"/>
                  <i className="fa fa-microchip p-2" style={{fontSize: "17pt"}} aria-hidden="true"/>
                  <span className="bold pt-2 pb-2">{this.state.gatewayUsage[0][this.state.gatewayUsage.length-1]} </span>
                  <i className="fa fa-database p-2 pl-3"style={{fontSize: "16pt"}} aria-hidden="true"/>
                  <span className="bold pt-2 pb-2 pr-2">{this.state.gatewayMemoryUsage[0][this.state.gatewayMemoryUsage[0].length-1] +"mb/" +this.state.gatewayMemoryUsage[1] +"mb"} </span>


                  {/*<NavItem>
                    <form className="form-inline">
                      <input className="form-control mr-sm-1" type="search" placeholder="Search" aria-label="Search" />
                      <Button type="submit" className="d-none d-sm-block">
                        <i className="fa fa-search" />
                      </Button>
                    </form>
                  </NavItem>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      New
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>Project</DropdownItem>
                      <DropdownItem>User</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem>
                        Message <Badge color="primary">10</Badge>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav>
                      <Avatar size="small" color="blue" initials="JS" />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>Option 1</DropdownItem>
                      <DropdownItem>Option 2</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem>Reset</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>*/}
                </React.Fragment>
              </Header>
              <PageContent>
                <Switch>
                  {routes.map((page, key) => (
                    <Route path={page.path} component={page.component} key={key} />
                  ))}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </PageContent>
            </Page>
          </div>
          <Footer>
            <span>Copyright © Group 3 - Offensive Technologies 2019/2020 @ UNITN</span>
            <span className="ml-auto hidden-xs">
              Made with{' '}
              <span role="img" aria-label="taco">
               ❤️
              </span>
            </span>
          </Footer>
          {/*<Chat.Container> TODO - IMPLEMENT CHAT
            {this.state.showChat1 && (
              <Chat.ChatBox name="Messages" status="online" image={avatar1} close={this.closeChat} />
            )}
          </Chat.Container>
            */}
        </div>
      </ContextProviders>
    );
  }
}
