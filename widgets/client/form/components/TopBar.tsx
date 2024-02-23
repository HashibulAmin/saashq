import * as React from "react";

type Props = {
  color: string;
  title: string;
};

function TopBar({ title, color }: Props) {
  return (
    <div className="saashq-topbar thiner" style={{ backgroundColor: color }}>
      <div className="saashq-middle">
        <div className="saashq-topbar-title">
          <div>{title}</div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
