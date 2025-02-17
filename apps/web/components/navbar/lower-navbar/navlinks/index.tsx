import ActiveLink from "@/components/ui/ActiveLink";



const Navlinks = () => {
    return (
        <div className="flex gap-10 font-medium text-sm uppercase">
            <ActiveLink href="/" text="Home" />
            <ActiveLink href="/services" text="Services" />
            <ActiveLink href="/shop" text="Shop" />
            <ActiveLink href="/offers" text="Offers" />
            <ActiveLink href="/wishlist" text="Wishlist" />
        </div>
    );
};

export default Navlinks;
