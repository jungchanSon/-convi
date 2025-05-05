import Script from 'next/script';

const GoogleAnalyticsTag = () => {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID

    return (
        <>
            <Script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
                id="google-analytics"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_ID}');`,
                }}
            />
        </>);
}

export default GoogleAnalyticsTag