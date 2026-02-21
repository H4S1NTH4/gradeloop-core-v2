export default function UnauthorizedPage() {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="max-w-md text-center">
                <h1 className="text-3xl font-bold">Unauthorized</h1>
                <p className="mt-4 text-muted-foreground">You do not have access to this page.</p>
            </div>
        </div>
    );
}
