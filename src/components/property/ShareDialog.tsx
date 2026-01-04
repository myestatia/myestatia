import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, MessageCircle, Mail, Check } from "lucide-react";
import { toast } from "sonner";
import { Property } from "@/api/properties";

interface ShareDialogProps {
    property: Property;
    children?: React.ReactNode;
}

const ShareDialog = ({ property, children }: ShareDialogProps) => {
    const [copied, setCopied] = useState(false);
    const publicUrl = `${window.location.origin}/p/${property.id}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const shareText = `Check out this property: ${property.title} - ${property.price ? property.price.toLocaleString() + '€' : 'Consult price'}`;

    const handleWhatsApp = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(shareText + " " + publicUrl)}`;
        window.open(url, '_blank');
    };

    const handleEmail = () => {
        const subject = encodeURIComponent(`Property Interest: ${property.title}`);
        const body = encodeURIComponent(`${shareText}\n\nView details here: ${publicUrl}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: property.title,
                    text: shareText,
                    url: publicUrl,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Property</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-6 py-4">
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Input
                                defaultValue={publicUrl}
                                readOnly
                                className="h-9"
                            />
                        </div>
                        <Button size="sm" className="px-3" onClick={handleCopy}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <Button
                            variant="outline"
                            className="flex flex-col h-20 gap-2 items-center justify-center border-emerald-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                            onClick={handleWhatsApp}
                        >
                            <MessageCircle className="h-6 w-6 text-emerald-500" />
                            <span className="text-xs">WhatsApp</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex flex-col h-20 gap-2 items-center justify-center border-blue-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                            onClick={handleEmail}
                        >
                            <Mail className="h-6 w-6 text-blue-500" />
                            <span className="text-xs">Email</span>
                        </Button>
                        {navigator.share && (
                            <Button
                                variant="outline"
                                className="flex flex-col h-20 gap-2 items-center justify-center"
                                onClick={handleNativeShare}
                            >
                                <Share2 className="h-6 w-6 text-slate-500" />
                                <span className="text-xs">System</span>
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareDialog;
