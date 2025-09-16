export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-black/5">
      <div className="container-max py-8 text-sm text-gray-600 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Nirvaan. Student wellbeing, with warmth.</p>
        <p>
          Need help now? Visit <a className="underline" href="https://www.iasp.info/resources/Crisis_Centres/" target="_blank" rel="noreferrer">international crisis resources</a>.
        </p>
      </div>
    </footer>
  );
}


