import "./Navbar.css";

interface NavbarProps {
    toggleCalendarVisibility: () => void;
    isCalendarVisible: boolean;
  }


  export default function Navbar({ toggleCalendarVisibility, isCalendarVisible }: NavbarProps) {
    return <nav className = "nav">
    <a href = "/" className="site-title">Rewindify</a>
    <div className="button-group"> {/* Add a container for the buttons */}
    <button>About</button>
    <button>Help</button>
    <button onClick={toggleCalendarVisibility} 
                  className="toggle-calendar-button">        
                  {isCalendarVisible ? "Hide Calendar" : "Show Calendar"}
</button>
</div>

    </nav>
}