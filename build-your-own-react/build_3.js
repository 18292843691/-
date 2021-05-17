(function () {
  // *************** 实现 fiber **************** //
  const TEXT_ELEMENT = "TEXT_ELEMENT";

  const ELEMENT_TYPE = {
    TEXT: "TEXT_ELEMENT",
  };

  const EFFECT_TAG = {
    UPDATE: "UPDATE",
    PLACEMENT: "PLACEMENT",
    DELETION: "DELETION",
  };

  const createElement = (type, props, ...children) => {
    return {
      type,
      props: {
        ...props,
        children: children.map((child) => {
          return typeof child === "object" ? child : createTextElement(child);
        }),
      },
    };
  };

  const createTextElement = (text) => {
    return {
      type: TEXT_ELEMENT,
      props: {
        nodeValue: text,
        children: [],
      },
    };
  };

  const React = {
    createElement,
  };

  const isProperty = (key) => key !== "children" && !isEvent(key);
  const isNew = (prev, next) => (key) => prev[key] !== next[key];
  const isGone = (prev, next) => (key) => !(key in next);
  const isEvent = (key) => {
    return key.startsWith("on");
  };

  const createDom = (fiber) => {
    const dom =
      fiber.type === TEXT_ELEMENT
        ? document.createTextNode("")
        : document.createElement(fiber.type);

    Object.keys(fiber.props)
      .filter(isProperty)
      .map((name) => {
        dom[name] = fiber.props[name];
      });

    // filter.props.children.map(child => render(child, dom))
    // container.appendChild(dom)
    return dom;
  };

  const updateDom = (dom, prevProps, nextProps) => {
    // remove old properties
    Object.keys(prevProps)
      .filter(isProperty)
      .filter(isGone)
      .forEach((name) => {
        dom[name] = "";
      });

    // remove old eventlistener
    Object.keys(prevProps)
      .filter(isEvent)
      .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
      .forEach((name) => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
      });

    // Set new or changed properties
    Object.keys(nextProps)
      .filter(isProperty)
      .filter(isNew(prevProps, next))
      .forEach((name) => {
        dom[name] = nextProps[name];
      });

    // Set new or changed eventlistener
    Object.keys(nextProps)
      .filter(isEvent)
      .filter(isNew(prevProps, nextProps))
      .forEach((name) => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, prevProps[name]);
      });
  };

  const commitRoot = () => {
    deletions.forEach(commitWork);
    console.log("commitRoot 阶段开始");

    commitWork(wipRoot.child);
    currentRoot = wipRoot;
    wipRoot = null;

    console.log("commitRoot 阶段结束");
  };

  const commitWork = (fiber) => {
    if (!fiber) {
      return;
    }
    console.log("commitWork 递", fiber.type);
    let domParentfiber = fiber.parent;

    while (!domParentfiber.dom) {
      console.log("commitWork 归", domParentfiber.type);
      domParentfiber = domParentfiber.parent;
    }

    const domParent = domParentfiber.dom;
    // domParent.appendChild(fiber.dom)
    if (fiber.effectTag === EFFECT_TAG.PLACEMENT && fiber.dom != null) {
      // console.log('插入节点', fiber.type)
      domParent.appendChild(fiber.dom);
    } else if (fiber.effectTag === EFFECT_TAG.DELETION) {
      // domParent.removeChild(fiber.dom)
      console.log("删除节点");
      commitDeletion(fiber, domParent);
    } else if (fiber.effectTag === EFFECT_TAG.UPDATE && fiber.dom !== null) {
      console.log("更新节点");
      updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    }
    commitWork(fiber.child);
    commitWork(fiber.sibling);
  };

  const commitDeletion = (fiber, domParent) => {
    if (fiber.dom) {
      domParent.removeChild(fiber.dom);
    } else {
      commitDeletion(fiber.child, domParent);
    }
  };

  const render = (element, container) => {
    wipRoot = {
      dom: container,
      props: {
        children: [element],
      },
      alternate: currentRoot,
    };

    console.log("render start");
    deletions = [];
    nextUnitOfWork = wipRoot;
  };

  const ReactDOM = {
    render,
  };

  let nextUnitOfWork = null;
  let wipRoot = null;
  let currentRoot = null;
  let deletions = null;

  const workLoop = (deadline) => {
    let showYield = false;

    while (nextUnitOfWork && !showYield) {
      // console.log('nextUnitOfWork', nextUnitOfWork, showYield)
      // https://pomb.us/static/a88a3ec01855349c14302f6da28e2b0c/ac667/fiber1.png
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
      // 如果idle period已经结束，则它的值是0。你的回调函数(传给requestIdleCallback的函数)可以重复的访问这个属性用来判断当前线程的闲置时间是否可以在结束前执行更多的任务。
      showYield = deadline.timeRemaining() < 1;
    }

    if (!nextUnitOfWork && wipRoot) {
      console.log("构建fiber树结束", wipRoot);
      commitRoot();
    }

    window.requestIdleCallback(workLoop);
  };

  requestIdleCallback(workLoop);

  const performUnitOfWork = (fiber) => {
    console.log("performUnitOfWork start", fiber);
    // add dom node
    const isFunctionComponent = fiber.type instanceof Function;
    if (isFunctionComponent) {
      updateFunctionComponent(fiber);
    } else {
      updateHostComponent(fiber);
    }

    // return next unit of work
    if (fiber.child) {
      return fiber.child;
    }

    let nextFiber = fiber;
    while (nextFiber) {
      if (nextFiber.sibling) {
        return nextFiber.sibling;
      }
      nextFiber = nextFiber.parent;
    }
  };

  const reconcileChildren = (wipFiber, elements) => {
    let index = 0;
    let oldFiber = wipFiber.alternate?.child;
    let preSibling = null;

    while (index < elements.length || oldFiber) {
      const ele = elements[index];
      let newFiber = null;

      const isSameType = oldFiber && ele && oldFiber.type === ele.type;

      if (isSameType) {
        newFiber = {
          type: oldFiber.type,
          props: ele.props,
          dom: oldFiber.dom,
          parent: wipFiber,
          alternate: oldFiber,
          effectTag: EFFECT_TAG.UPDATE,
        };
      }

      if (ele && !isSameType) {
        newFiber = {
          type: ele.type,
          props: ele.props,
          dom: null,
          parent: wipFiber,
          alternate: null,
          effectTag: EFFECT_TAG.PLACEMENT,
        };
      }

      if (oldFiber && !isSameType) {
        oldFiber.effectTag = EFFECT_TAG.DELETION;
        deletions.push(oldFiber);
      }

      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }

      if (index === 0) {
        wipFiber.child = newFiber;
      } else {
        preSibling.sibling = newFiber;
      }

      preSibling = newFiber;
      index++;
    }
  };

  const updateFunctionComponent = (fiber) => {
    const children = [fiber.type(fiber.props)];

    // add hooks
    wipFiber = fiber;
    hookIndex = 0;
    wipFiber.hooks = [];

    reconcileChildren(fiber, children);
  };

  const updateHostComponent = (fiber) => {
    if (!fiber.dom) {
      fiber.dom = createDom(fiber);
    }
    reconcileChildren(fiber, fiber.props.children);
  };
  // ******************************* //

  const element = React.createElement(
    "div",
    {
      id: "foo",
    },
    React.createElement("a", { id: "a", href: "#" }, "a"),
    React.createElement(
      "span",
      {
        id: "span",
        onClick: () => {
          console.log("click");
        },
      },
      "span"
    )
  );

  // console.log('element', element)

  const container = document.getElementById("root");
  ReactDOM.render(element, container);
})();
