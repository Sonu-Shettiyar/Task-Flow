import { Result, Button } from "antd";

import Header from "../components/Headers";

const NotFound = () => {   

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center py-20">
        <Result
          status="404"
          title="404"
          subTitle="Oops! Page not found"
          extra={
            <Button type="primary" href="/">
              Return to Home
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default NotFound;
