const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SOLITUDE. All rights reserved.</p>
        <p className="text-sm mt-2">
          A hub for 2D and 3D creative assets.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
