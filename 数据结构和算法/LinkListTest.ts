import LinkList from "./LinkList";

// const linkList = new LinkList(1)

// linkList.next = new LinkList(2)

// const fromLink = LinkList.from([3, 4, 6])

// console.log(linkList)

// console.log(LinkList.printList(fromLink));

// console.log(fromLink);

// fromLink.add(linkList)

const l1 = new LinkList(1)
const l2 = LinkList.from([2, 3, 4])
l1.insertEnd(2).insertEnd(3).insertStart(1.5).insert(6, 1).removeAt(2)
LinkList.printList(l1)
LinkList.printList(l1.reserve())

