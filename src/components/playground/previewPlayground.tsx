import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Send, Share2, ShoppingBag, Star, TrendingUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";

const statHighlights = [
  { label: "Active workspaces", value: "1,204", change: "+14%", progress: 72 },
  { label: "Signup conversion", value: "38%", change: "+4.2%", progress: 38 },
  { label: "ARPU", value: "$126", change: "+$8.40", progress: 54 },
  { label: "NPS", value: "61", change: "Stable", progress: 61 },
];

const inboxMessages = [
  {
    id: 1,
    name: "Brianna Chen",
    time: "2m ago",
    body: "Could we darken the sidebar background just a touch? It feels too close to the canvas.",
  },
  {
    id: 2,
    name: "Harper Mills",
    time: "17m ago",
    body: "Typography set looks 🔥. Ship this to the landing page and blog templates?",
  },
  {
    id: 3,
    name: "Owen Patel",
    time: "1h ago",
    body: "Charts tab checks out — gradients read clearly in both light and dark.",
  },
];

const recentOrders = [
  { id: "INV-1046", customer: "Solstice Studio", status: "Fulfilled", amount: "$4,200" },
  { id: "INV-1045", customer: "Arcadia Labs", status: "Pending", amount: "$2,180" },
  { id: "INV-1044", customer: "Northwind", status: "Refunded", amount: "$860" },
  { id: "INV-1043", customer: "Just Peachy", status: "Fulfilled", amount: "$1,540" },
];

const activity = [
  {
    title: "Shadows polished",
    byline: "Vic updated radius + depth tokens",
    time: "Today · 9:18 AM",
  },
  {
    title: "Marketing kit exported",
    byline: "Download shared with @design-leads",
    time: "Yesterday · 6:42 PM",
  },
  {
    title: "Sidebar sync",
    byline: "Dark palette inherited accent tokens",
    time: "Yesterday · 2:10 PM",
  },
];

export function PreviewPlayground() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview Playground</CardTitle>
        <CardDescription>Drop shadcn components here to see how the live theme feels.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border-border/70">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="uppercase tracking-wide">
                  New drop
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="rounded-full">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Open product actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>Share</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Share2 className="size-4" /> Copy link
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="size-4" /> Send to chat
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <BellRing className="size-4" /> Notify subscribers
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">Lumina Workspace revamp</CardTitle>
                <CardDescription>
                  See how hero layouts, CTA buttons, and supporting body copy adapt to your palette
                  before exporting the CSS variables.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button>
                  Launch preview <ShoppingBag className="ml-2 size-4" />
                </Button>
                <Button variant="secondary">Schedule share</Button>
                <Button variant="outline" className="gap-2">
                  <TrendingUp className="size-4" />
                  View impact
                </Button>
              </div>
              <div className="flex items-center gap-4 rounded-lg border bg-background/70 p-4">
                <Star className="size-10 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Brand consistency</p>
                  <p className="text-xl font-semibold">A+</p>
                  <p className="text-sm text-muted-foreground">
                    Buttons, typography, and cards pull from the same tokens.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Experience metrics</CardTitle>
              <CardDescription>Colors, depth, and type choices update these immediately.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {statHighlights.map((stat) => (
                <div key={stat.label} className="rounded-lg border bg-background/80 p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <span>{stat.label}</span>
                    <Badge variant="outline">{stat.change}</Badge>
                  </div>
                  <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                  <Progress value={stat.progress} className="mt-3" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Lead capture</CardTitle>
              <CardDescription>Test inputs, helper text, and button group spacing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="Mara Winters" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" placeholder="mara@studio.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brief">Project brief</Label>
                <Textarea id="brief" placeholder="What aesthetic are you going for?" rows={3} />
              </div>
              <div className="flex items-center gap-2 rounded-md border bg-muted/30 p-3">
                <Checkbox id="updates" defaultChecked />
                <Label htmlFor="updates" className="text-sm text-muted-foreground">
                  Email me when presets change or new palettes drop.
                </Label>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="ghost">Cancel</Button>
                <Button>Save brief</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader className="flex items-start justify-between space-y-0">
              <div>
                <CardTitle>Team inbox</CardTitle>
                <CardDescription>Scroll to preview chat surfaces & avatars.</CardDescription>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <MessageSquare className="size-3.5" /> Live
              </Badge>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-56 pr-4">
                <div className="space-y-4">
                  {inboxMessages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="size-10 border">
                        <AvatarImage alt={message.name} />
                        <AvatarFallback>{message.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          {message.name}
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{message.body}</p>
                        <button className="text-xs font-medium text-primary">Reply</button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Separator className="my-4" />
              <div className="flex items-end gap-3">
                <Textarea
                  className="min-h-[90px] flex-1"
                  placeholder="Drop a note for the team…"
                />
                <Button size="icon">
                  <Send className="size-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Orders & approvals</CardTitle>
              <CardDescription>Tables show off border/input tokens.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell className="font-medium">{order.customer}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            order.status === "Pending" && "text-amber-700 dark:text-amber-300",
                            order.status === "Refunded" && "text-destructive",
                          )}
                          variant={order.status === "Pending" ? "secondary" : "outline"}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{order.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="text-sm text-muted-foreground">
                Hover rows to preview subtle backgrounds. Badges inherit semantic colors.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>System status</CardTitle>
              <CardDescription>Alerts + switches exercise semantic hues.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTitle className="flex items-center gap-2 font-semibold">
                  <TrendingUp className="size-4" />
                  Deploy preview ready
                </AlertTitle>
                <AlertDescription>
                  Light/dark tokens are synced. Export variables to push to staging.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTitle>Contrast check</AlertTitle>
                <AlertDescription>
                  Sidebar accent fails WCAG AA for small text. Consider boosting saturation.
                </AlertDescription>
              </Alert>
              <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
                {activity.map((item) => (
                  <div key={item.title} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.byline}</p>
                    </div>
                    <Switch aria-label={item.title} defaultChecked />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
