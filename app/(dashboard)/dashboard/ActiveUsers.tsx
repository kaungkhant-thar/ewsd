import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Eye, MessageCircle } from "lucide-react";

// Mock data for active users
const activeUsers = [
  {
    name: "Olivia Martin",
    email: "oliver@gmail.com",
    ideas: 1,
    views: 1,
    comments: 1,
    profileImage: "https://placekitten.com/40/40", // replace with real URL or image path
  },
  {
    name: "Olivia Martin",
    email: "oliver@gmail.com",
    ideas: 1,
    views: 1,
    comments: 4,
    profileImage: "https://placekitten.com/40/40",
  },
  {
    name: "Olivia Martin",
    email: "oliver@gmail.com",
    ideas: 10,
    views: 1,
    comments: 1,
    profileImage: "https://placekitten.com/40/40",
  },
  {
    name: "Olivia Martin",
    email: "oliver@gmail.com",
    ideas: 1,
    views: 8,
    comments: 1,
    profileImage: "https://placekitten.com/40/40",
  },
  {
    name: "Olivia Martin",
    email: "oliver@gmail.com",
    ideas: 1,
    views: 1,
    comments: 1,
    profileImage: "https://placekitten.com/40/40",
  },
  {
    name: "Olivia Martin",
    email: "oliver@gmail.com",
    ideas: 1,
    views: 1,
    comments: 1,
    profileImage: "https://placekitten.com/40/40",
  },
  {
    name: "Olivia Martin",
    email: "oliver@gmail.com",
    ideas: 1,
    views: 1,
    comments: 1,
    profileImage: "https://placekitten.com/40/40",
  },
];

export function ActiveUsers() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead colSpan={2}>Top active users</TableHead>
          <TableHead className="text-center">
            <FileText size={16} className="text-gray-500" />
          </TableHead>
          <TableHead className="text-center">
            <Eye size={16} className="text-gray-500" />
          </TableHead>
          <TableHead className="text-center">
            <MessageCircle size={16} className="text-gray-500" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activeUsers.map((user, index) => (
          <TableRow key={index}>
            <TableCell className="flex items-center space-x-3">
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </TableCell>

            <TableCell className="text-center">{user.ideas}</TableCell>
            <TableCell className="text-center">{user.views}</TableCell>
            <TableCell className="text-center">{user.comments}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
